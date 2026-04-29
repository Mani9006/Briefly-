#!/usr/bin/env python3
"""Attention Stability Index (ASI) reference implementations.

Computes the five ASI metrics from the AttentionRSI paper:
  - APC : Attention Pattern Correlation
  - HAE : Head Activation Entropy
  - CATT: Cross-Task Attention Transfer
  - CPI : Capability Preservation Index (proxy)
  - HID : Head Importance Drift

All operate on synthetic attention tensors so the script runs without a model
checkpoint. Produces:
  outputs/experiments/asi_metrics.csv

Mathematical definitions (matching paper notation, simplified for sim):

  APC(A, A') = mean_{l,h} corr( vec(A_{l,h}),  vec(A'_{l,h}) )
  HAE(A)    = mean_{l,h} -sum_i p_i log p_i  where p = mean over queries
  CATT(A_taskA, A_taskB) = mean_{l,h} cosine( hist_A_{l,h}, hist_B_{l,h} )
  CPI(c, c') = c' / c  (downstream metric ratio; here we simulate)
  HID(W, W') = mean_l ||top-k(I_l) - top-k(I_l')||_1 / k
              where I_l is per-head importance via attention-output norm.
"""
from __future__ import annotations

import csv
import math
import random
from pathlib import Path

random.seed(3)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "outputs" / "experiments"
OUT.mkdir(parents=True, exist_ok=True)


# --------- minimal vector helpers (no numpy) ---------
def _mat(rows, cols, fn):
    return [[fn(i, j) for j in range(cols)] for i in range(rows)]


def _flatten(m):
    return [x for row in m for x in row]


def _mean(xs):
    return sum(xs) / len(xs) if xs else 0.0


def _std(xs):
    m = _mean(xs)
    return math.sqrt(_mean([(x - m) ** 2 for x in xs])) if xs else 0.0


def _corr(xs, ys):
    mx, my = _mean(xs), _mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))
    return num / den if den > 1e-12 else 0.0


def _cos(xs, ys):
    num = sum(a * b for a, b in zip(xs, ys))
    den = math.sqrt(sum(a * a for a in xs) * sum(b * b for b in ys))
    return num / den if den > 1e-12 else 0.0


def _softmax_row(row):
    m = max(row)
    ex = [math.exp(x - m) for x in row]
    s = sum(ex)
    return [e / s for e in ex]


def _softmax(mat):
    return [_softmax_row(row) for row in mat]


# --------- synthetic attention tensors ---------
def make_attention(L: int, n_layers: int, n_heads: int, seed_off: int = 0):
    """Return list of layers; each layer is list of heads; each head is L x L softmaxed."""
    rng = random.Random(seed_off)
    out = []
    for l in range(n_layers):
        layer = []
        for h in range(n_heads):
            raw = _mat(L, L, lambda i, j: rng.gauss(0.0, 1.0) + (1.5 if abs(i - j) < 3 else 0))
            layer.append(_softmax(raw))
        out.append(layer)
    return out


def perturb(att, magnitude: float, seed_off: int = 99):
    rng = random.Random(seed_off)
    out = []
    for layer in att:
        new_layer = []
        for head in layer:
            raw = [[v + rng.gauss(0, magnitude) for v in row] for row in head]
            new_layer.append(_softmax(raw))
        out.append(new_layer)
    return out


# --------- five ASI metrics ---------
def APC(A, Ap) -> float:
    vals = []
    for la, lb in zip(A, Ap):
        for ha, hb in zip(la, lb):
            vals.append(_corr(_flatten(ha), _flatten(hb)))
    return _mean(vals)


def HAE(A) -> float:
    ents = []
    for layer in A:
        for head in layer:
            cols = len(head[0])
            mean_attn = [_mean([row[j] for row in head]) for j in range(cols)]
            ent = -sum(p * math.log(p + 1e-12) for p in mean_attn)
            ents.append(ent)
    return _mean(ents)


def CATT(A_taskA, A_taskB) -> float:
    cs = []
    for la, lb in zip(A_taskA, A_taskB):
        for ha, hb in zip(la, lb):
            ha_hist = [_mean(col) for col in zip(*ha)]
            hb_hist = [_mean(col) for col in zip(*hb)]
            cs.append(_cos(ha_hist, hb_hist))
    return _mean(cs)


def CPI(downstream_before: float, downstream_after: float) -> float:
    if downstream_before <= 0:
        return 0.0
    return downstream_after / downstream_before


def head_importance(att) -> list[list[float]]:
    """One score per (layer, head) - here, sum of attention placed on non-self positions."""
    out = []
    for layer in att:
        per_head = []
        for head in layer:
            score = sum(row[j] for i, row in enumerate(head) for j in range(len(row)) if j != i)
            per_head.append(score)
        out.append(per_head)
    return out


def HID(A, Ap, k: int = 4) -> float:
    I = head_importance(A)
    Ip = head_importance(Ap)
    diffs = []
    for layer_a, layer_b in zip(I, Ip):
        # rank heads, compare top-k by index
        topk_a = sorted(range(len(layer_a)), key=lambda h: -layer_a[h])[:k]
        topk_b = sorted(range(len(layer_b)), key=lambda h: -layer_b[h])[:k]
        diffs.append(len(set(topk_a).symmetric_difference(topk_b)) / (2 * k))
    return _mean(diffs)


def main():
    L, n_layers, n_heads = 24, 6, 8

    A_pre = make_attention(L, n_layers, n_heads, seed_off=1)
    A_post_sdft = perturb(A_pre, magnitude=0.05, seed_off=2)   # SDFT: small drift
    A_post_naive_ft = perturb(A_pre, magnitude=0.30, seed_off=3)  # naive FT: large drift
    A_taskB = make_attention(L, n_layers, n_heads, seed_off=42)  # different task

    rows = [
        ("scenario", "APC", "HAE_pre", "HAE_post", "CATT", "CPI", "HID@4"),
    ]

    for label, A_post, downstream in [
        ("SDFT_continual",     A_post_sdft,     (0.62, 0.61)),
        ("Naive_finetune",     A_post_naive_ft, (0.62, 0.41)),
        ("RSI_inner_loop_ok",  perturb(A_pre, 0.08, seed_off=11),  (0.62, 0.66)),
        ("RSI_collapse",       perturb(A_pre, 0.45, seed_off=12),  (0.62, 0.30)),
    ]:
        rows.append((
            label,
            round(APC(A_pre, A_post), 4),
            round(HAE(A_pre), 4),
            round(HAE(A_post), 4),
            round(CATT(A_pre, A_taskB), 4),
            round(CPI(*downstream), 4),
            round(HID(A_pre, A_post, k=4), 4),
        ))

    csv_path = OUT / "asi_metrics.csv"
    with csv_path.open("w", newline="") as f:
        csv.writer(f).writerows(rows)

    print(f"wrote {csv_path}\n")
    widths = [22, 7, 9, 9, 7, 7, 8]
    print("  ".join(h.ljust(w) for h, w in zip(rows[0], widths)))
    for r in rows[1:]:
        print("  ".join(str(c).ljust(w) for c, w in zip(r, widths)))

    print("\ninterpretation:")
    print("  - SDFT_continual: high APC, low HID, near-1 CPI -> attention preserved")
    print("  - Naive_finetune: low APC, high HID, low CPI    -> catastrophic forgetting")
    print("  - RSI_inner_loop_ok: APC stays high while CPI > 1   -> healthy improvement")
    print("  - RSI_collapse: APC drops, HID large, CPI < 1       -> degenerate loop")


if __name__ == "__main__":
    main()
