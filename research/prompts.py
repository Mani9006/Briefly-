"""Prompts used for per-model research, critique, and synthesis."""
from research.papers import Paper

SYSTEM_RESEARCHER = (
    "You are a senior ML researcher contributing to an IEEE TPAMI submission. "
    "Be precise, cite year and venue when referring to prior work, and flag any "
    "claim you are not sure about. Use IEEE-style numeric citations like [1]. "
    "Do not invent author names or venues; if uncertain, write [REF NEEDED] inline."
)

SYSTEM_CRITIC = (
    "You are an adversarial peer reviewer at IEEE TPAMI. Identify weak claims, "
    "missing baselines, statistical issues, and threats to validity. Be specific "
    "with line- or section-level pointers. Do not propose rewrites; only critique."
)

SYSTEM_SYNTHESIZER = (
    "You are the lead author finalizing an IEEE TPAMI submission. You will be "
    "given multiple model contributions and critiques. Produce a single coherent, "
    "publication-ready draft section. Resolve disagreements by citing the strongest "
    "supporting argument; do not paper over them. Preserve all numeric claims that "
    "appear in the original paper unless explicitly contradicted with a citation."
)


def researcher_prompt(paper: Paper) -> list[dict[str, str]]:
    user = f"""Paper: {paper.title}
Target venue: {paper.venue}

Topic summary (from existing draft):
{paper.topic_summary}

Open questions the existing draft does NOT fully resolve:
{chr(10).join(f"  - {q}" for q in paper.open_questions)}

Key terms (use them precisely):
{", ".join(paper.key_terms)}

Your task. Produce a self-contained 1500-2500 word research contribution that:
  1. Adds at least two pieces of related work the original draft likely missed (be honest about uncertainty).
  2. Strengthens the central claim with one new analytical argument or formal lemma.
  3. Proposes one concrete additional experiment with a clear protocol (datasets, metrics, baselines, ablations, expected outcome).
  4. Identifies the single weakest claim in the existing draft and explains how to defend or weaken it.
  5. Provides a 6-10 entry reference list in IEEE numeric style. Mark any reference you are not 100% certain of with [VERIFY].

Format your answer with these section headings exactly:
  ## Additional Related Work
  ## Strengthening the Central Claim
  ## Proposed Additional Experiment
  ## Weakest-Claim Audit
  ## References (IEEE)
"""
    return [
        {"role": "system", "content": SYSTEM_RESEARCHER},
        {"role": "user", "content": user},
    ]


def critic_prompt(paper: Paper, contributions: dict[str, str]) -> list[dict[str, str]]:
    bundle = "\n\n".join(
        f"### Contribution from {label}\n{txt[:6000]}"
        for label, txt in contributions.items()
        if txt
    )
    user = f"""Paper: {paper.title}

Below are research contributions from {len(contributions)} different frontier models.
Critique them as an adversarial reviewer. For each contribution, list:
  - Strongest claim
  - Weakest claim
  - Any factual error (cite which line)
  - Any claim that conflicts with another contribution (cite both)

Then end with a single recommendation: which contribution should anchor the
final synthesis, and why.

Contributions:
{bundle}
"""
    return [
        {"role": "system", "content": SYSTEM_CRITIC},
        {"role": "user", "content": user},
    ]


def synthesizer_prompt(
    paper: Paper,
    contributions: dict[str, str],
    critiques: dict[str, str],
) -> list[dict[str, str]]:
    contrib_bundle = "\n\n".join(
        f"### {label}\n{txt[:5000]}" for label, txt in contributions.items() if txt
    )
    crit_bundle = "\n\n".join(
        f"### critique by {label}\n{txt[:3000]}" for label, txt in critiques.items() if txt
    )
    user = f"""Paper: {paper.title}
Target venue: {paper.venue}

You have N model contributions and M critiques. Produce a single
publication-ready supplementary section titled "Multi-Model Research Addendum"
that the human author (Manikanta Reddy Mandadhi) can paste into the existing
LaTeX draft. The addendum must contain:

  1. ## Extended Related Work  (consensus across contributions, deduplicated)
  2. ## Strengthened Central Claim  (the single best analytical argument)
  3. ## Additional Experiment  (one experiment, with full protocol)
  4. ## Weakest-Claim Defense  (one paragraph defending or qualifying the weakest claim)
  5. ## Multi-Model Disagreements  (bullet list of any unresolved disagreements with model labels)
  6. ## Consolidated References (IEEE)  (deduplicated, [VERIFY] preserved)

Style: IEEE TPAMI. Concise. No bullet padding. No "as the contributions show" filler.

Contributions:
{contrib_bundle}

Critiques:
{crit_bundle}
"""
    return [
        {"role": "system", "content": SYSTEM_SYNTHESIZER},
        {"role": "user", "content": user},
    ]
