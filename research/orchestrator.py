"""Run all top-tier models in parallel against each paper.

Pipeline per paper:
  1. researcher_prompt -> every model in HIGH_TIER_MODELS, in parallel
  2. critic_prompt with all contributions -> 2-3 critic models, in parallel
  3. synthesizer_prompt with contributions + critiques -> first available SYNTHESIZER_PREFERRED

Outputs:
  outputs/<paper_id>/contributions/<label>.md
  outputs/<paper_id>/critiques/<label>.md
  outputs/<paper_id>/synthesis.md         <- the final addendum
  outputs/<paper_id>/run.json             <- timings, errors, model list
"""
from __future__ import annotations

import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from research.models import HIGH_TIER_MODELS, SYNTHESIZER_PREFERRED, ModelSpec, by_id as model_by_id
from research.nvidia_client import ChatResult, chat_complete
from research.papers import Paper
from research.prompts import critic_prompt, researcher_prompt, synthesizer_prompt


def _run_one(model: ModelSpec, messages: list[dict[str, str]]) -> ChatResult:
    return chat_complete(
        model.id,
        messages,
        max_tokens=model.max_tokens,
        temperature=model.temperature,
    )


def _parallel(jobs: list[tuple[ModelSpec, list[dict[str, str]]]]) -> dict[str, ChatResult]:
    results: dict[str, ChatResult] = {}
    with ThreadPoolExecutor(max_workers=max(2, len(jobs))) as ex:
        future_to_label = {
            ex.submit(_run_one, m, msgs): m.label for m, msgs in jobs
        }
        for fut in as_completed(future_to_label):
            label = future_to_label[fut]
            try:
                results[label] = fut.result()
            except Exception as e:
                results[label] = ChatResult(model=label, text="", error=f"{type(e).__name__}: {e}")
    return results


def run_paper(paper: Paper, out_root: Path, models: list[ModelSpec] | None = None) -> dict:
    models = models or HIGH_TIER_MODELS
    paper_dir = out_root / paper.paper_id
    (paper_dir / "contributions").mkdir(parents=True, exist_ok=True)
    (paper_dir / "critiques").mkdir(parents=True, exist_ok=True)

    run = {
        "paper_id": paper.paper_id,
        "title": paper.title,
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "models": [m.id for m in models],
        "contributions": {},
        "critiques": {},
        "synthesis_model": None,
        "errors": [],
    }

    # Phase 1: parallel research
    print(f"[{paper.paper_id}] phase 1: {len(models)} models researching in parallel")
    contrib_jobs = [(m, researcher_prompt(paper)) for m in models]
    contrib_results = _parallel(contrib_jobs)

    contributions: dict[str, str] = {}
    for label, res in contrib_results.items():
        spec = next((m for m in models if m.label == label), None)
        path = paper_dir / "contributions" / f"{label}.md"
        if res.error:
            path.write_text(f"# {label} ({spec.id if spec else label})\n\nERROR: {res.error}\n")
            run["contributions"][label] = {"ok": False, "error": res.error, "elapsed_s": res.elapsed_s}
            run["errors"].append({"phase": "research", "model": label, "error": res.error})
        else:
            path.write_text(f"# {label} ({spec.id if spec else label})\n\n{res.text}\n")
            contributions[label] = res.text
            run["contributions"][label] = {"ok": True, "elapsed_s": res.elapsed_s, "chars": len(res.text)}

    if not contributions:
        run["errors"].append({"phase": "synthesis", "error": "no successful contributions; skipping synth"})
        (paper_dir / "run.json").write_text(json.dumps(run, indent=2))
        return run

    # Phase 2: parallel critique by 2-3 critic-capable models
    critic_pool = [m for m in models if m.role in ("critic", "reasoner")][:3]
    if not critic_pool:
        critic_pool = models[:2]
    print(f"[{paper.paper_id}] phase 2: {len(critic_pool)} critics")
    crit_jobs = [(m, critic_prompt(paper, contributions)) for m in critic_pool]
    crit_results = _parallel(crit_jobs)

    critiques: dict[str, str] = {}
    for label, res in crit_results.items():
        spec = next((m for m in critic_pool if m.label == label), None)
        path = paper_dir / "critiques" / f"{label}.md"
        if res.error:
            path.write_text(f"# critique by {label}\n\nERROR: {res.error}\n")
            run["critiques"][label] = {"ok": False, "error": res.error}
            run["errors"].append({"phase": "critique", "model": label, "error": res.error})
        else:
            path.write_text(f"# critique by {label} ({spec.id if spec else label})\n\n{res.text}\n")
            critiques[label] = res.text
            run["critiques"][label] = {"ok": True, "elapsed_s": res.elapsed_s, "chars": len(res.text)}

    # Phase 3: synthesis with first preferred model that succeeds
    print(f"[{paper.paper_id}] phase 3: synthesis")
    synth_text: str | None = None
    for synth_id in SYNTHESIZER_PREFERRED:
        spec = model_by_id(synth_id)
        if spec is None:
            continue
        msgs = synthesizer_prompt(paper, contributions, critiques)
        res = chat_complete(spec.id, msgs, max_tokens=8000, temperature=0.3)
        if res.error:
            run["errors"].append({"phase": "synthesis", "model": spec.label, "error": res.error})
            continue
        synth_text = res.text
        run["synthesis_model"] = spec.id
        run["synthesis_elapsed_s"] = res.elapsed_s
        break

    if synth_text is None:
        synth_text = "# Synthesis failed\n\nAll preferred synthesizers errored. See run.json.\n"

    (paper_dir / "synthesis.md").write_text(
        f"# Multi-Model Research Addendum: {paper.title}\n\n"
        f"_Synthesized by `{run['synthesis_model']}` from "
        f"{len(contributions)} contributions and {len(critiques)} critiques._\n\n"
        f"{synth_text}\n"
    )

    run["finished_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    (paper_dir / "run.json").write_text(json.dumps(run, indent=2))
    print(f"[{paper.paper_id}] done. errors={len(run['errors'])}")
    return run
