#!/usr/bin/env python3
"""Heuristic audit for runtime third-party dependencies in a static Vite site.

It is NOT a reachability test and cannot guarantee mainland-China access.
Usage: python3 audit_mainland_assets.py PATH_TO_WEBSITE
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

SOURCE_SUFFIXES = {".html", ".css", ".js", ".jsx", ".ts", ".tsx", ".svg"}
IGNORE_DIRS = {"node_modules", "dist", ".git", "coverage", ".wrangler"}
PATTERNS = [
    ("CSS remote @import", re.compile(r"@import\s+(?:url\s*\()?\s*['\"]?https?://", re.I)),
    ("remote script / stylesheet / image", re.compile(r"<(?:script|link|img|iframe|video|audio|source)\b[^>]*(?:src|href)\s*=\s*['\"]https?://", re.I)),
    ("runtime fetch remote URL", re.compile(r"\b(?:fetch|axios\.get|axios\.post|EventSource|WebSocket)\s*\(\s*['\"](?:https?:|wss?:)//", re.I)),
    ("CSS remote url()", re.compile(r"url\s*\(\s*['\"]?https?://", re.I)),
]
SUSPICIOUS_HOSTS = ("fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net", "unpkg.com", "cdnjs.cloudflare.com")


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 audit_mainland_assets.py WEBSITE_ROOT")
        return 2
    root = Path(sys.argv[1]).expanduser().resolve()
    if not root.exists() or not (root / "package.json").exists():
        print(f"ERROR: {root} is not a recognizable website root (package.json missing).")
        return 2
    findings: list[str] = []
    scanned = 0
    for path in root.rglob("*"):
        if any(part in IGNORE_DIRS for part in path.relative_to(root).parts):
            continue
        if not path.is_file() or path.suffix.lower() not in SOURCE_SUFFIXES:
            continue
        scanned += 1
        content = path.read_text(encoding="utf-8", errors="replace")
        for name, rx in PATTERNS:
            if rx.search(content):
                findings.append(f"{path.relative_to(root)}: {name}")
        # For manually configured URL strings in source, flag known third-party hosts.
        if any(host in content for host in SUSPICIOUS_HOSTS):
            findings.append(f"{path.relative_to(root)}: known external asset/CDN host")
    if findings:
        print(f"WARNING: {len(findings)} potential external runtime dependencies in {scanned} files:")
        for msg in findings:
            print("  -", msg)
        print("Review and bundle any essential assets locally. This cannot prove mainland accessibility.")
        return 1
    print(f"PASS: scanned {scanned} source files; no common mandatory remote asset patterns found.")
    print("Reminder: this is not a live mainland-network access test.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
