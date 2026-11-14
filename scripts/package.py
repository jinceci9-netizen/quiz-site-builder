#!/usr/bin/env python3
"""Create cross-agent release ZIPs with a single canonical Skill tree."""
from __future__ import annotations
import argparse
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SKILL = REPO / 'skills' / 'quiz-site-builder'
STARTER = SKILL / 'assets' / 'starter'
VERSION = '0.3.0'
EXCLUDE_DIR = {'.git','node_modules','__pycache__','dist','.pytest_cache'}
EXCLUDE_SUFFIXES = {'.pyc', '.DS_Store'}


def source_files(root):
    for file in sorted(root.rglob('*')):
        if not file.is_file(): continue
        if any(x in EXCLUDE_DIR for x in file.relative_to(root).parts): continue
        if file.suffix in EXCLUDE_SUFFIXES or file.name in EXCLUDE_SUFFIXES: continue
        yield file


def save(out, base, files):
    with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for file in files:
            z.write(file, file.relative_to(base).as_posix())
    with zipfile.ZipFile(out) as z:
        failure=z.testzip()
        if failure: raise RuntimeError(f'bad ZIP entry: {failure}')
    print(out, f'({out.stat().st_size} bytes)')


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--output', type=Path,default=REPO / 'dist')
    args=ap.parse_args()
    dest=args.output.resolve()
    dest.mkdir(parents=True,exist_ok=True)
    if not (SKILL/'SKILL.md').is_file(): raise SystemExit('Missing canonical SKILL.md')
    # ZIP root `quiz-site-builder/` matches WorkBuddy published packaging examples.
    save(dest/f'quiz-site-builder-workbuddy-v{VERSION}.zip',SKILL.parent,source_files(SKILL))
    save(dest/f'quiz-site-builder-skill-v{VERSION}.zip',SKILL.parent,source_files(SKILL))
    save(dest/f'quiz-site-builder-demo-v{VERSION}.zip',STARTER.parent,source_files(STARTER))
    save(dest/f'quiz-site-builder-github-v{VERSION}.zip',REPO.parent,source_files(REPO))


if __name__=='__main__': main()
