"""Metadata about the three target papers.

Each paper carries a topic spec used to seed the per-model research prompt.
The seed text is drawn from the abstract / introduction of the existing PDF.
"""
from dataclasses import dataclass


@dataclass(frozen=True)
class Paper:
    paper_id: str          # short slug used for filenames
    title: str
    pdf: str               # source PDF in repo root
    venue: str             # target venue / format
    topic_summary: str     # what the paper is about
    open_questions: list[str]
    key_terms: list[str]


HRCF = Paper(
    paper_id="hrcf",
    title="HRCF: A Hybrid Recursive-Folding Framework for Long-Horizon Reasoning in LLMs Beyond the Context Window",
    pdf="HRCF paper1.pdf",
    venue="IEEE TPAMI",
    topic_summary=(
        "HRCF unifies Recursive Language Models (Zhang 2025) with Context-Folding (Sun et al. 2025) "
        "under a single per-fragment dispatch policy over a context-topology DAG. Fragments are labelled "
        "STATIC, DYNAMIC, or MIXED and routed to R-DELEGATE (RLM-style sub-LLM call), F-BRANCHRETURN "
        "(branch-summarize-fold), or A-FOLD (anchored fold with regex-addressable handles into the "
        "summary). HRCF is evaluated on Multi-Document Needle-in-Haystack (up to 2M tokens), "
        "OOLONG-Pairs aggregation, and a SWE simulation harness."
    ),
    open_questions=[
        "How does the topology classifier degrade when fragment access patterns shift mid-trajectory?",
        "What is the optimal anchored-fold handle density for trajectories with re-reference rate above 0.4?",
        "Can the per-fragment cost model be extended to multi-tenant inference where token cost is non-uniform?",
        "Does HRCF improve calibration of the parent model's attention to sub-trajectory summaries?",
    ],
    key_terms=[
        "RLM", "context folding", "anchored fold", "context topology",
        "needle-in-haystack", "OOLONG-Pairs", "SWE-Bench", "token budget",
    ],
)

ARIS = Paper(
    paper_id="aris",
    title="ARIS: Adaptive Inference-Time Scaling via Recursive Self-Improvement with Compute-Optimal Allocation",
    pdf="ARIS paper2.pdf",
    venue="IEEE TPAMI",
    topic_summary=(
        "ARIS partitions a fixed inference budget B across four channels - Parallel, Sequential, "
        "Verifier-Search, and Policy-Rewrite - via a learned difficulty-aware policy. The objective is "
        "monotone submodular under a fidelity assumption, giving a (1-1/e)-greedy approximation. "
        "Evaluated on MATH, AIME 2024, GPQA Diamond, LiveCodeBench, SWE-Bench Verified with three base "
        "models. Pareto-dominates Snell et al. above 4x single-pass cost."
    ),
    open_questions=[
        "What features dominate the difficulty predictor when extended to multimodal inputs?",
        "How does ARIS interact with native reasoning models (R1, o3, Nemotron-Ultra) whose Sequential is implicit?",
        "Can the four-channel decomposition absorb agentic tool use as a fifth channel without breaking submodularity?",
        "What is the regret bound when difficulty calibration drifts over a deployment?",
    ],
    key_terms=[
        "test-time compute", "Best-of-N", "self-consistency", "Self-Refine",
        "PRM", "MCTS", "AlphaEvolve", "compute-optimal", "submodular",
    ],
)

ATTENTION_RSI = Paper(
    paper_id="attention_rsi",
    title="Attention Mechanisms in Self-Improving AI Systems: A Position Paper Bridging Continual Learning and RSI",
    pdf="AttentionRSI paper3.pdf",
    venue="IEEE TPAMI (position)",
    topic_summary=(
        "Position paper unifying SDFT-style continual learning, recursive language models / context "
        "folding, and recursive self-improvement (RSI) through attention dynamics. Proposes the "
        "Attention Stability Index (ASI) with five metrics: APC, HAE, CATT, CPI, HID. States the "
        "attention-stability hypothesis and a 2026-2030 roadmap with governance considerations."
    ),
    open_questions=[
        "Is the attention-stability hypothesis falsifiable on existing public checkpoint pairs (pre/post SDFT)?",
        "What is the empirical correlation between APC drop and downstream capability loss?",
        "Does cross-task attention transfer (CATT) predict positive forward transfer across domains?",
        "What attention-logging schema scales to production RSI deployments without leaking training-set features?",
    ],
    key_terms=[
        "SDFT", "RLM", "context folding", "ASI", "APC", "HAE", "CATT",
        "CPI", "HID", "attention head", "continual learning",
    ],
)


ALL_PAPERS: list[Paper] = [HRCF, ARIS, ATTENTION_RSI]


def by_id(paper_id: str) -> Paper:
    for p in ALL_PAPERS:
        if p.paper_id == paper_id:
            return p
    raise KeyError(f"unknown paper id: {paper_id}")
