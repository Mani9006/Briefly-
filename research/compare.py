"""Cross-model comparison report.

Runs over outputs/<paper_id>/contributions/*.md and produces a short
quantitative + qualitative comparison: length, vocabulary overlap, unique
references claimed, and a table of section-presence.
"""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

REF_RE = re.compile(r"\[(\d+)\]")
SECTION_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
WORD_RE = re.compile(r"[A-Za-z][A-Za-z0-9_-]+")
EXPECTED_SECTIONS = [
    "Additional Related Work",
    "Strengthening the Central Claim",
    "Proposed Additional Experiment",
    "Weakest-Claim Audit",
    "References",
]


def _tokens(text: str) -> list[str]:
    return [w.lower() for w in WORD_RE.findall(text)]


def compare_paper(paper_dir: Path) -> dict:
    contrib_dir = paper_dir / "contributions"
    if not contrib_dir.exists():
        return {"error": f"no contributions/ dir in {paper_dir}"}

    rows = []
    all_vocab: dict[str, set[str]] = {}
    section_table: dict[str, dict[str, bool]] = {}

    for f in sorted(contrib_dir.glob("*.md")):
        text = f.read_text()
        label = f.stem
        toks = _tokens(text)
        vocab = set(toks)
        all_vocab[label] = vocab

        sections = SECTION_RE.findall(text)
        section_table[label] = {
            s: any(s.lower() in sec.lower() for sec in sections)
            for s in EXPECTED_SECTIONS
        }
        refs = REF_RE.findall(text)

        rows.append({
            "model": label,
            "chars": len(text),
            "tokens": len(toks),
            "unique_vocab": len(vocab),
            "ref_citations": len(refs),
            "distinct_refs": len(set(refs)),
            "errored": text.startswith("ERROR") or "ERROR:" in text.splitlines()[1:3].__str__(),
        })

    # vocabulary overlap matrix
    labels = sorted(all_vocab.keys())
    overlap = {}
    for a in labels:
        overlap[a] = {}
        for b in labels:
            if a == b:
                overlap[a][b] = 1.0
                continue
            inter = len(all_vocab[a] & all_vocab[b])
            union = max(1, len(all_vocab[a] | all_vocab[b]))
            overlap[a][b] = round(inter / union, 3)

    # most-shared technical tokens
    counter: Counter[str] = Counter()
    for v in all_vocab.values():
        counter.update(v)
    shared_terms = [w for w, c in counter.most_common(60) if c >= max(2, len(labels) // 2) and len(w) > 4]

    return {
        "paper_dir": str(paper_dir),
        "models_compared": labels,
        "rows": rows,
        "section_presence": section_table,
        "jaccard_overlap": overlap,
        "shared_technical_terms": shared_terms[:40],
    }


def write_comparison(paper_dir: Path) -> Path:
    report = compare_paper(paper_dir)
    out = paper_dir / "comparison.json"
    out.write_text(json.dumps(report, indent=2))

    md = paper_dir / "comparison.md"
    rows = report.get("rows", [])
    lines = [
        f"# Cross-Model Comparison: {paper_dir.name}",
        "",
        "## Per-model stats",
        "",
        "| model | chars | tokens | unique vocab | refs | errored |",
        "|---|---:|---:|---:|---:|:---:|",
    ]
    for r in rows:
        lines.append(
            f"| {r['model']} | {r['chars']} | {r['tokens']} | {r['unique_vocab']} | "
            f"{r['ref_citations']} | {'yes' if r['errored'] else 'no'} |"
        )

    lines += ["", "## Required-section coverage", ""]
    sec_table = report.get("section_presence", {})
    if sec_table:
        sections = list(next(iter(sec_table.values())).keys())
        header = "| model | " + " | ".join(sections) + " |"
        sep = "|---|" + "|".join(["---"] * len(sections)) + "|"
        lines += [header, sep]
        for label, secs in sec_table.items():
            row = "| " + label + " | " + " | ".join("yes" if secs[s] else "no" for s in sections) + " |"
            lines.append(row)

    lines += ["", "## Vocabulary Jaccard overlap", ""]
    ov = report.get("jaccard_overlap", {})
    if ov:
        labels = sorted(ov.keys())
        lines.append("| | " + " | ".join(labels) + " |")
        lines.append("|---|" + "|".join(["---:"] * len(labels)) + "|")
        for a in labels:
            row = "| " + a + " | " + " | ".join(f"{ov[a][b]:.3f}" for b in labels) + " |"
            lines.append(row)

    lines += [
        "",
        "## Shared technical terms (appearing across most models)",
        "",
        ", ".join(report.get("shared_technical_terms", [])) or "_none_",
        "",
    ]
    md.write_text("\n".join(lines))
    return md
