#!/usr/bin/env python3
"""ARIS supporting experiment: four-channel budget allocation simulator.

Reproduces the setup of ARIS Section IV: given a question difficulty d in [0,1]
and a budget B (in units of single-pass cost), allocate across four channels
  P (Parallel), S (Sequential), V (Verifier-Search), R (Policy-Rewrite)
such that bP + bS + bV + bR <= B.

Per-channel accuracy curves are calibrated to public scaling-law shapes:
  - P:  acc_P(b, d) = 1 - exp(-alpha_P * b * (1-d))
  - S:  acc_S(b, d) = 1 - exp(-alpha_S * sqrt(b) * (0.6 + 0.4*(1-d)))
  - V:  acc_V(b, d) = 1 - exp(-alpha_V * b * (0.8 + 0.2*d))   # verifier helps hardest
  - R:  acc_R(b, d) = 1 - exp(-alpha_R * b * (0.5 + 0.5*d))   # rewriting wins on hard

ARIS predicts d via a noisy oracle and runs a (1-1/e) greedy allocation in
unit-cost steps. Baselines: SINGLE-CHANNEL-BEST (oracle), SNELL (uniform mix
of P and S only), UNIFORM (B/4 to each).

Outputs:
  outputs/experiments/aris_budget.csv   - per-budget x policy accuracy
  outputs/experiments/aris_curve.txt    - ASCII Pareto curve
"""
from __future__ import annotations

import csv
import math
import random
from pathlib import Path

random.seed(11)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "outputs" / "experiments"
OUT.mkdir(parents=True, exist_ok=True)

ALPHA = {"P": 0.55, "S": 0.85, "V": 0.50, "R": 0.40}


def acc(channel: str, b: float, d: float) -> float:
    if b <= 0:
        return 0.0
    a = ALPHA[channel]
    if channel == "P":
        return 1 - math.exp(-a * b * (1 - d))
    if channel == "S":
        return 1 - math.exp(-a * math.sqrt(b) * (0.6 + 0.4 * (1 - d)))
    if channel == "V":
        return 1 - math.exp(-a * b * (0.8 + 0.2 * d))
    if channel == "R":
        return 1 - math.exp(-a * b * (0.5 + 0.5 * d))
    raise ValueError(channel)


def combined_accuracy(alloc: dict[str, float], d: float) -> float:
    """Probability at-least-one channel succeeds (independence assumption)."""
    fail = 1.0
    for c, b in alloc.items():
        fail *= (1 - acc(c, b, d))
    return 1 - fail


def aris_greedy(B: int, d_hat: float, step: float = 1.0) -> dict[str, float]:
    alloc = {"P": 0.0, "S": 0.0, "V": 0.0, "R": 0.0}
    spent = 0.0
    while spent + step <= B + 1e-9:
        base = combined_accuracy(alloc, d_hat)
        gains = {}
        for c in alloc:
            trial = dict(alloc)
            trial[c] += step
            gains[c] = combined_accuracy(trial, d_hat) - base
        best = max(gains, key=gains.get)
        if gains[best] <= 1e-9:
            break
        alloc[best] += step
        spent += step
    return alloc


def best_single_channel(B: int, d: float) -> tuple[str, float]:
    best = max(("P", "S", "V", "R"), key=lambda c: acc(c, B, d))
    return best, acc(best, B, d)


def snell_pol(B: int, d: float) -> dict[str, float]:
    # Snell et al.: difficulty-blind P/S mix; favour S on easy, P on hard.
    if d < 0.5:
        return {"P": 0.0, "S": float(B), "V": 0.0, "R": 0.0}
    return {"P": float(B), "S": 0.0, "V": 0.0, "R": 0.0}


def uniform(B: int) -> dict[str, float]:
    q = B / 4.0
    return {"P": q, "S": q, "V": q, "R": q}


def main():
    rows = [("budget", "difficulty", "policy", "alloc", "expected_accuracy")]
    budgets = [1, 2, 4, 8, 16, 32, 64]
    difficulties = [0.1, 0.3, 0.5, 0.7, 0.9]

    summary = {p: {B: [] for B in budgets} for p in ("ARIS", "BEST-SINGLE", "SNELL", "UNIFORM")}

    for d in difficulties:
        for B in budgets:
            d_hat = max(0.0, min(1.0, d + random.gauss(0, 0.07)))  # noisy difficulty oracle

            aris_a = aris_greedy(B, d_hat)
            aris_acc = combined_accuracy(aris_a, d)
            rows.append((B, d, "ARIS", _fmt(aris_a), round(aris_acc, 4)))
            summary["ARIS"][B].append(aris_acc)

            ch, ba = best_single_channel(B, d)
            rows.append((B, d, "BEST-SINGLE", ch, round(ba, 4)))
            summary["BEST-SINGLE"][B].append(ba)

            sa = snell_pol(B, d)
            sa_acc = combined_accuracy(sa, d)
            rows.append((B, d, "SNELL", _fmt(sa), round(sa_acc, 4)))
            summary["SNELL"][B].append(sa_acc)

            ua = uniform(B)
            ua_acc = combined_accuracy(ua, d)
            rows.append((B, d, "UNIFORM", _fmt(ua), round(ua_acc, 4)))
            summary["UNIFORM"][B].append(ua_acc)

    csv_path = OUT / "aris_budget.csv"
    with csv_path.open("w", newline="") as f:
        csv.writer(f).writerows(rows)
    print(f"wrote {csv_path}")

    txt_path = OUT / "aris_curve.txt"
    lines = ["ARIS budget vs accuracy (mean over difficulties 0.1..0.9)\n"]
    lines.append(f"{'B':>4} {'ARIS':>8} {'BEST-1':>8} {'SNELL':>8} {'UNIFORM':>8} {'ARIS-vs-Snell':>14}")
    for B in budgets:
        ar = sum(summary['ARIS'][B]) / len(summary['ARIS'][B])
        bs = sum(summary['BEST-SINGLE'][B]) / len(summary['BEST-SINGLE'][B])
        sn = sum(summary['SNELL'][B]) / len(summary['SNELL'][B])
        un = sum(summary['UNIFORM'][B]) / len(summary['UNIFORM'][B])
        lines.append(f"{B:>4} {ar:>8.3f} {bs:>8.3f} {sn:>8.3f} {un:>8.3f} {ar - sn:>+14.3f}")
    txt = "\n".join(lines) + "\n"
    txt_path.write_text(txt)
    print(txt)
    print(f"wrote {txt_path}")


def _fmt(alloc: dict[str, float]) -> str:
    return ";".join(f"{c}={alloc[c]:.1f}" for c in ("P", "S", "V", "R"))


if __name__ == "__main__":
    main()
