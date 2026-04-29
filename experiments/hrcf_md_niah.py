#!/usr/bin/env python3
"""HRCF supporting experiment: Multi-Document Needle-in-a-Haystack simulator.

This is a *cost model* simulator (no LLM call) that reproduces the comparison
in HRCF Section IX between three policies on synthetic MD-NIAH inputs:

  - PURE-RLM         : every fragment dispatched via R-DELEGATE
  - PURE-FOLD        : every fragment dispatched via F-BRANCHRETURN
  - HRCF             : per-fragment dispatch under the topology classifier

We model:
  - input length L (tokens), distributed across F fragments
  - each fragment has access pattern in {STATIC, DYNAMIC, MIXED}
  - per-primitive token cost: r_delegate(n) = a1*n^0.5 + b1
                              branch_return(n) = a2*log(n) + b2
                              a_fold(n) = a2*log(n) + b2 + h*handles
  - per-primitive recall: STATIC favors R-DELEGATE; DYNAMIC favors F-BRANCH;
    MIXED favors A-FOLD

Outputs:
  outputs/experiments/hrcf_md_niah.csv  - per-(L, policy) cost & recall
  prints a summary table

Run: python3 experiments/hrcf_md_niah.py
"""
from __future__ import annotations

import csv
import math
import random
from dataclasses import dataclass
from pathlib import Path

random.seed(7)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "outputs" / "experiments"
OUT.mkdir(parents=True, exist_ok=True)


@dataclass
class Fragment:
    n_tokens: int
    pattern: str  # STATIC | DYNAMIC | MIXED


def make_doc(L: int, n_frags: int, mix=(0.5, 0.3, 0.2)) -> list[Fragment]:
    s_p, d_p, m_p = mix
    sizes = [max(64, int(random.gauss(L / n_frags, L / (4 * n_frags)))) for _ in range(n_frags)]
    total = sum(sizes)
    sizes = [int(s * L / total) for s in sizes]
    frags = []
    for s in sizes:
        r = random.random()
        if r < s_p:
            p = "STATIC"
        elif r < s_p + d_p:
            p = "DYNAMIC"
        else:
            p = "MIXED"
        frags.append(Fragment(s, p))
    return frags


def cost_r_delegate(n: int) -> float:
    # RLM pays for one or more sub-LLM calls over slices: ~1.4n with overhead per slice
    slices = max(1, n // 8000)
    return 1.4 * n + 220.0 * slices


def cost_branch_return(n: int) -> float:
    # Fold reads the branch once, then a summary pass: ~n + summary
    return 1.0 * n + 180.0


def cost_a_fold(n: int, handles: int = 4) -> float:
    # Anchored fold = fold + handle-extraction overhead, but downstream re-extraction is free
    return cost_branch_return(n) + 12.0 * handles


def recall(primitive: str, pattern: str) -> float:
    table = {
        ("R-DELEGATE",     "STATIC"):  0.96,
        ("R-DELEGATE",     "DYNAMIC"): 0.62,
        ("R-DELEGATE",     "MIXED"):   0.78,
        ("F-BRANCHRETURN", "STATIC"):  0.71,
        ("F-BRANCHRETURN", "DYNAMIC"): 0.93,
        ("F-BRANCHRETURN", "MIXED"):   0.74,
        ("A-FOLD",         "STATIC"):  0.83,
        ("A-FOLD",         "DYNAMIC"): 0.86,
        ("A-FOLD",         "MIXED"):   0.91,
    }
    return table[(primitive, pattern)]


def policy_pure_rlm(frags):
    cost = sum(cost_r_delegate(f.n_tokens) for f in frags)
    rec = sum(f.n_tokens * recall("R-DELEGATE", f.pattern) for f in frags) / max(1, sum(f.n_tokens for f in frags))
    return cost, rec


def policy_pure_fold(frags):
    cost = sum(cost_branch_return(f.n_tokens) for f in frags)
    rec = sum(f.n_tokens * recall("F-BRANCHRETURN", f.pattern) for f in frags) / max(1, sum(f.n_tokens for f in frags))
    return cost, rec


def policy_hrcf(frags):
    cost = 0.0
    weighted_recall = 0.0
    for f in frags:
        if f.pattern == "STATIC":
            prim = "R-DELEGATE"
            c = cost_r_delegate(f.n_tokens)
        elif f.pattern == "DYNAMIC":
            prim = "F-BRANCHRETURN"
            c = cost_branch_return(f.n_tokens)
        else:
            prim = "A-FOLD"
            c = cost_a_fold(f.n_tokens)
        cost += c
        weighted_recall += f.n_tokens * recall(prim, f.pattern)
    rec = weighted_recall / max(1, sum(f.n_tokens for f in frags))
    return cost, rec


def main():
    rows = [("L_tokens", "n_fragments", "policy", "cost_tokens", "recall")]
    summary = []
    for L in (50_000, 200_000, 500_000, 1_000_000, 2_000_000):
        for n_frags in (8, 32, 128):
            frags = make_doc(L, n_frags)
            for name, fn in (("PURE-RLM", policy_pure_rlm),
                             ("PURE-FOLD", policy_pure_fold),
                             ("HRCF", policy_hrcf)):
                c, r = fn(frags)
                rows.append((L, n_frags, name, round(c, 1), round(r, 3)))
                summary.append((L, n_frags, name, c, r))

    csv_path = OUT / "hrcf_md_niah.csv"
    with csv_path.open("w", newline="") as f:
        csv.writer(f).writerows(rows)

    print(f"wrote {csv_path}")
    print()
    print(f"{'L':>10} {'frags':>6} {'policy':>14} {'cost':>10} {'recall':>7}")
    for L, n, p, c, r in summary:
        print(f"{L:>10} {n:>6} {p:>14} {c:>10.0f} {r:>7.3f}")

    # simple aggregate: HRCF improvement vs best baseline at each (L, n)
    by_key = {}
    for L, n, p, c, r in summary:
        by_key.setdefault((L, n), {})[p] = (c, r)
    print("\nHRCF iso-recall token savings vs best non-hybrid baseline:")
    print("  (baseline cost is rescaled to match HRCF recall via independent retries)")
    for (L, n), d in sorted(by_key.items()):
        hrcf_c, hrcf_r = d["HRCF"]
        # iso-recall scaling: to reach recall r_hrcf using a primitive with recall r_b,
        # expected #independent attempts = log(1-r_hrcf) / log(1-r_b)
        def iso_cost(c_b: float, r_b: float, r_target: float) -> float:
            if r_b <= 0 or r_b >= 1 or r_target <= r_b:
                return c_b
            tries = math.log(1 - r_target) / math.log(1 - r_b)
            return c_b * tries
        rlm_iso = iso_cost(*d["PURE-RLM"], r_target=hrcf_r)
        fold_iso = iso_cost(*d["PURE-FOLD"], r_target=hrcf_r)
        best_iso = min(rlm_iso, fold_iso)
        savings = (best_iso - hrcf_c) / best_iso if best_iso > 0 else 0.0
        print(f"  L={L:>7} n={n:>3}  hrcf_cost={hrcf_c:>9.0f}  best_iso={best_iso:>10.0f}  savings={savings:+.1%}")


if __name__ == "__main__":
    main()
