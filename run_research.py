#!/usr/bin/env python3
"""Entry point: run multi-model research + comparison + synthesis.

Usage:
  export NVIDIA_API_KEY=nvapi-...
  python3 run_research.py                     # all 3 papers
  python3 run_research.py hrcf                # single paper
  python3 run_research.py hrcf aris           # subset
  python3 run_research.py --dry-run           # offline shape check
"""
import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from research.compare import write_comparison
from research.orchestrator import run_paper
from research.papers import ALL_PAPERS, by_id


def cmd_dry_run(papers, out_root):
    """Validate prompts and config without calling the API."""
    from research.models import HIGH_TIER_MODELS
    from research.prompts import researcher_prompt

    for p in papers:
        msgs = researcher_prompt(p)
        out_root.mkdir(parents=True, exist_ok=True)
        path = out_root / f"{p.paper_id}_dryrun.json"
        path.write_text(json.dumps({
            "paper_id": p.paper_id,
            "title": p.title,
            "n_models": len(HIGH_TIER_MODELS),
            "models": [m.id for m in HIGH_TIER_MODELS],
            "system_chars": len(msgs[0]["content"]),
            "user_chars": len(msgs[1]["content"]),
            "user_preview": msgs[1]["content"][:600],
        }, indent=2))
        print(f"[dry-run] {p.paper_id}: {len(HIGH_TIER_MODELS)} models, prompt={len(msgs[1]['content'])} chars")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paper_ids", nargs="*", help="paper ids to run; default = all")
    ap.add_argument("--dry-run", action="store_true", help="no API calls; only emit shape diagnostics")
    ap.add_argument("--out", default="outputs", help="output root directory")
    args = ap.parse_args()

    papers = [by_id(pid) for pid in args.paper_ids] if args.paper_ids else ALL_PAPERS
    out_root = (ROOT / args.out).resolve()

    if args.dry_run:
        cmd_dry_run(papers, out_root)
        return 0

    if not os.environ.get("NVIDIA_API_KEY"):
        print("ERROR: set NVIDIA_API_KEY (get one at https://build.nvidia.com)", file=sys.stderr)
        return 2

    out_root.mkdir(parents=True, exist_ok=True)

    for p in papers:
        run_paper(p, out_root)
        comp_md = write_comparison(out_root / p.paper_id)
        print(f"[{p.paper_id}] comparison written to {comp_md.relative_to(ROOT)}")

    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
