#!/usr/bin/env python3
"""No-dependency structural and distribution checks for the portable skill."""
from pathlib import Path
import ast
import re
import tempfile
import subprocess
import sys
import zipfile

ROOT=Path(__file__).resolve().parents[1]
SKILL=ROOT/'skills/quiz-site-builder'
S=SKILL/'SKILL.md'
assert S.is_file(), 'missing SKILL.md'
text=S.read_text(encoding='utf-8')
assert text.startswith('---\n'), 'missing YAML frontmatter'
front=text.split('---', 2)[1]
name=re.search(r'^name:\s*(.+)$',front,re.M)
assert name and name.group(1).strip()=='quiz-site-builder', 'invalid skill name'
assert re.search(r'^description:\s*',front,re.M),'missing description'
assert re.search(r'^display_name:\s*',front,re.M), 'missing WorkBuddy market display name'
assert re.search(r'^version:\s*',front,re.M), 'missing WorkBuddy market version'
assert re.search(r'^author:\s*',front,re.M), 'missing WorkBuddy market author'
assert (SKILL/'references/quiz-design.md').is_file()
assert (SKILL/'references/mainland-readiness.md').is_file()
assert (SKILL/'references/access-codes-optional.md').is_file()
assert (SKILL/'assets/starter/src/engine.ts').is_file()
for file in (ROOT/'scripts').glob('*.py'):
    ast.parse(file.read_text(encoding='utf-8'),filename=str(file))
assert not (ROOT/'.agents').exists(), 'old duplicated provider skill folder unexpectedly present'
assert '.agents/skills/quiz-site-builder' not in text, 'hard-coded Codex skill location in core instructions'
with tempfile.TemporaryDirectory() as temp:
    p=Path(temp)
    r=subprocess.run([sys.executable,str(ROOT/'scripts/package.py'),'--output',str(p)],capture_output=True,text=True)
    assert r.returncode == 0, r.stdout+r.stderr
    for name in ('workbuddy','skill','demo','github'):
        zp=p/f'quiz-site-builder-{name}-v0.3.0.zip'
        assert zp.exists(),name
        with zipfile.ZipFile(zp) as z:
            assert z.testzip() is None
            if name=='workbuddy':
                assert 'quiz-site-builder/SKILL.md' in z.namelist()
                assert 'quiz-site-builder/assets/starter/package.json' in z.namelist()
                assert all(not n.startswith('__MACOSX') for n in z.namelist())
    r=subprocess.run([sys.executable,str(ROOT/'scripts/install_skill.py'),'--target','codex','--scope','project','--project-root',str(p)],capture_output=True,text=True)
    assert r.returncode == 0, r.stdout+r.stderr
    assert (p/'.agents/skills/quiz-site-builder/SKILL.md').is_file()
    r=subprocess.run([sys.executable,str(ROOT/'scripts/install_skill.py'),'--target','codex','--scope','project','--project-root',str(p)],capture_output=True,text=True)
    assert r.returncode != 0, 'must not overwrite silently'
print('OK: portable Skill structure, package integrity, and safe installer checks')
