#!/usr/bin/env bash
# One-command driver. Assumes NVIDIA_API_KEY is exported.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${NVIDIA_API_KEY:-}" ]]; then
    echo "ERROR: export NVIDIA_API_KEY=nvapi-... first" >&2
    exit 2
fi

echo "== experiments (no API needed) =="
python3 experiments/hrcf_md_niah.py
python3 experiments/aris_budget_allocation.py
python3 experiments/asi_attention_metrics.py

echo
echo "== multi-model research (parallel NVIDIA NIM calls) =="
python3 run_research.py "$@"
