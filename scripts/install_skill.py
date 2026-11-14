#!/usr/bin/env python3
"""Copy the canonical Agent Skill into a supported local agent's discovery folder.

The installer intentionally has no network side effects and never overwrites by
accident. WorkBuddy desktop uses its UI ZIP import and is not a CLI install target.
"""
from __future__ import annotations
import argparse
import os
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SKILL = REPO / 'skills' / 'quiz-site-builder'

# (user path under home, project path under project root)
TARGETS = {
    'codex': (Path('.agents/skills'), Path('.agents/skills')),
    'claude': (Path('.claude/skills'), Path('.claude/skills')),
    'codebuddy-cli': (Path('.codebuddy/skills'), Path('.codebuddy/skills')),
    'opencode': (Path('.config/opencode/skills'), Path('.opencode/skills')),
}


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description='Install quiz-site-builder for an Agent Skills-compatible CLI')
    parser.add_argument('--target', choices=TARGETS, required=True)
    parser.add_argument('--scope', choices=['user', 'project'], default='user')
    parser.add_argument('--project-root', type=Path, default=Path.cwd())
    parser.add_argument('--force', action='store_true', help='Back up and replace existing installation')
    parser.add_argument('--dry-run', action='store_true', help='Print planned copy without writing')
    args = parser.parse_args(argv)

    if not (SKILL / 'SKILL.md').is_file():
        parser.error('Canonical skills/quiz-site-builder/SKILL.md not found')
    user_rel, project_rel = TARGETS[args.target]
    base = Path.home() if args.scope == 'user' else args.project_root.resolve()
    dest = base / (user_rel if args.scope == 'user' else project_rel) / SKILL.name
    if dest.resolve() == SKILL.resolve():
        print('Skill is already at the requested destination; nothing to copy.')
        return 0

    print(f'Source: {SKILL}\nDestination: {dest}\nMode: {args.scope}; agent: {args.target}')
    if args.dry_run:
        print('DRY RUN: no changes made')
        return 0

    if dest.exists() and not args.force:
        print('ERROR: destination already exists. Back it up or rerun with --force.',file=sys.stderr)
        return 2
    if dest.exists() and args.force:
        backup = dest.with_name(dest.name + '.previous')
        if backup.exists():
            print(f'ERROR: backup {backup} already exists; move it first.',file=sys.stderr)
            return 2
        dest.rename(backup)
        print(f'Backed up previous installation to {backup}')
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copytree(SKILL,dest)
    print(f'Installed successfully. Check {dest / "SKILL.md"}. Restart/reopen the agent if it does not discover the skill.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
