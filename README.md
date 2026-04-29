# Briefly — Multi-Model Research Pipeline for the IEEE TPAMI Drafts

This repo contains three IEEE TPAMI submissions by Manikanta Reddy Mandadhi:

- `HRCF paper1.pdf`         — Hybrid Recursive-Folding for long-horizon LLM reasoning
- `ARIS paper2.pdf`         — Adaptive Inference-Time Scaling via RSI with compute-optimal allocation
- `AttentionRSI paper3.pdf` — Attention Mechanisms in Self-Improving AI Systems (position paper)

…and a multi-model pipeline that uses **NVIDIA NIM** (build.nvidia.com) to have a
panel of frontier models do additional research, critique each other, and synthesize
a publication-ready supplementary section per paper.

## What runs

For each paper:

1. **12 frontier models in parallel** each produce a 1.5–2.5k-word research contribution
   (extra related work, a strengthened claim, a new experiment, a weakest-claim audit, refs).
2. **3 critic models in parallel** review all 12 contributions adversarially.
3. **1 synthesizer** (DeepSeek-R1, with Nemotron-Ultra and Llama-3.1-405B as fallbacks)
   merges contributions + critiques into a single LaTeX-paste-ready addendum.

Output layout (per paper):

```
outputs/<paper_id>/
  contributions/<model-label>.md   ← per-model research outputs
  critiques/<model-label>.md       ← per-model critiques
  synthesis.md                     ← the final supplementary section
  comparison.md / comparison.json  ← cross-model stats & section coverage
  run.json                         ← timings, errors, model list
```

The supporting **experiment scripts** (`experiments/`) are pure-Python cost-model
simulators that reproduce the comparisons in each paper without any LLM call.

## Models

Defined in `research/models.py`.

| Family | Models |
|---|---|
| NVIDIA   | `nemotron-ultra-253b-v1`, `nemotron-super-49b-v1` |
| Meta     | `llama-3.1-405b-instruct`, `llama-3.3-70b-instruct` |
| DeepSeek | `deepseek-r1`, `deepseek-v3` |
| Mistral  | `mistral-large-2-instruct`, `mixtral-8x22b-instruct-v0.1` |
| Qwen     | `qwq-32b`, `qwen2.5-coder-32b-instruct` |
| Other    | `microsoft/phi-4`, `01-ai/yi-large` |

If a model ID is unavailable on your NVIDIA account, the orchestrator logs the
404/403 to `run.json` and continues — the run does not abort.

## Quick start

```bash
# 1. set the API key (get one at https://build.nvidia.com)
export NVIDIA_API_KEY=nvapi-...

# 2. dry-run (no API calls, just prompt-shape diagnostics)
python3 run_research.py --dry-run

# 3. full pipeline for all three papers
python3 run_research.py

# or just one
python3 run_research.py hrcf
```

Or the one-command driver (experiments + research):

```bash
./scripts/run_all.sh
```

### Self-hosted NIM (optional)

If you spin up a local NIM container (`nvcr.io/nim/...`), point the same code at it:

```bash
export NVIDIA_BASE_URL=http://localhost:8000/v1
python3 run_research.py
```

## Experiments (no API key needed)

```bash
python3 experiments/hrcf_md_niah.py            # HRCF Section IX cost-model sim
python3 experiments/aris_budget_allocation.py  # ARIS four-channel allocator
python3 experiments/asi_attention_metrics.py   # ASI five-metric reference impl
```

All write CSVs into `outputs/experiments/`.

## File map

```
research/
  nvidia_client.py    NIM HTTP client (stdlib only)
  models.py           model registry (HIGH_TIER_MODELS, SYNTHESIZER_PREFERRED)
  papers.py           the 3 papers' topic specs
  prompts.py          researcher / critic / synthesizer prompts
  orchestrator.py     parallel runner (ThreadPoolExecutor)
  compare.py          cross-model comparison report

experiments/
  hrcf_md_niah.py             MD-NIAH cost-model simulator
  aris_budget_allocation.py   four-channel budget simulator
  asi_attention_metrics.py    APC, HAE, CATT, CPI, HID

run_research.py        entry point
scripts/run_all.sh     experiments + research one-shot
```
