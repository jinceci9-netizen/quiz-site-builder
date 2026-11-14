#!/usr/bin/env python3
"""Validate Quiz Site Builder JSON packs without external dependencies.

Usage: python3 validate_quizzes.py path/to/site/src/data
"""
import json
import sys
from pathlib import Path


def die(msg):
    raise ValueError(msg)


def need_str(obj, key, where):
    v = obj.get(key)
    if not isinstance(v, str) or not v.strip():
        die(f"{where}: {key} must be a nonempty string")
    return v


def check(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    where = path.name
    for key in ["id", "mode", "title", "tagline", "description"]:
        need_str(data, key, where)
    mode = data["mode"]
    if mode not in ("personality", "survival", "diagnostic"):
        die(f"{where}: unsupported mode {mode}")
    theme = data.get("theme")
    if not isinstance(theme, dict):
        die(f"{where}: missing theme")
    for key in ("accent", "paper"):
        need_str(theme, key, where)
    axes = data.get("axes")
    if not isinstance(axes, list):
        die(f"{where}: axes must be array")
    axis_ids = []
    for axis in axes:
        if not isinstance(axis, dict):
            die(f"{where}: axis must be object")
        axis_ids.append(need_str(axis, "id", where))
        need_str(axis, "label", where)
    if len(axis_ids) != len(set(axis_ids)):
        die(f"{where}: duplicate axes")
    if mode != "survival" and len(axis_ids) < 2:
        die(f"{where}: profile quizzes require at least two axes")
    outcomes = data.get("outcomes")
    if not isinstance(outcomes, dict) or not outcomes:
        die(f"{where}: missing outcomes")
    required_outcomes = {"early", "middle", "final"} if mode == "survival" else set(axis_ids)
    if set(outcomes) != required_outcomes:
        die(f"{where}: outcome ids must equal {sorted(required_outcomes)}")
    for oid, outcome in outcomes.items():
        if not isinstance(outcome, dict):
            die(f"{where}/{oid}: outcome must be object")
        for key in ("title", "subtitle", "story", "shareLine"):
            need_str(outcome, key, f"{where}/{oid}")
        for key in ("strengths", "advice"):
            arr = outcome.get(key)
            if not isinstance(arr, list) or len(arr) < 1 or not all(isinstance(x, str) and x.strip() for x in arr):
                die(f"{where}/{oid}: {key} should be nonempty list of strings")
    if mode == "survival":
        cfg = data.get("survival")
        if not isinstance(cfg, dict) or not isinstance(cfg.get("maxEpisode"), int) or not isinstance(cfg.get("dangerLimit"), int):
            die(f"{where}: missing survival settings")
        if cfg["maxEpisode"] <= 0 or cfg["dangerLimit"] <= 0 or type(cfg.get("minInfluence", 0)) is not int:
            die(f"{where}: survival settings should be >0")
    qs = data.get("questions")
    if not isinstance(qs, list) or not 3 <= len(qs) <= 40:
        die(f"{where}: expected 3–40 questions")
    question_ids = set()
    last_episode = 0
    for i, q in enumerate(qs):
        loc = f"{where}/Q{i+1}"
        qid = need_str(q, "id", loc)
        need_str(q, "prompt", loc)
        if qid in question_ids:
            die(f"{loc}: repeated id {qid}")
        question_ids.add(qid)
        if mode == "survival":
            ep = q.get("episode")
            if not isinstance(ep, int) or ep <= last_episode or ep > data["survival"]["maxEpisode"]:
                die(f"{loc}: episodes must increase, and be within maxEpisode")
            last_episode = ep
        opts = q.get("options")
        if not isinstance(opts, list) or not 2 <= len(opts) <= 5:
            die(f"{loc}: expected 2–5 options")
        ids = set()
        for opt in opts:
            oid = need_str(opt, "id", loc)
            need_str(opt, "label", loc)
            if oid in ids:
                die(f"{loc}: duplicate option id {oid}")
            ids.add(oid)
            effects = opt.get("effects")
            if not isinstance(effects, dict) or not effects:
                die(f"{loc}/{oid}: missing effects")
            permitted = {"danger", "influence"} if mode == "survival" else set(axis_ids)
            if not set(effects) <= permitted or (mode == "survival" and not {"danger", "influence"} <= set(effects)):
                die(f"{loc}/{oid}: invalid effects keys {set(effects)-permitted}")
            for k, val in effects.items():
                if type(val) is not int or abs(val) > 10:
                    die(f"{loc}/{oid}: {k} must be integer in [-10,10]")
    if mode == "survival" and last_episode != data["survival"]["maxEpisode"]:
        die(f"{where}: last question episode must equal maxEpisode")
    return data


def main():
    target = Path(sys.argv[1] if len(sys.argv) > 1 else "src/data")
    paths = [target] if target.is_file() else sorted(target.glob("*.json"))
    if not paths:
        sys.exit(f"No quiz JSON found at {target}")
    ids = set()
    try:
        for path in paths:
            data = check(path)
            if data["id"] in ids:
                die(f"duplicate quiz id: {data['id']}")
            ids.add(data["id"])
            print(f"✓ {path.name}: {len(data['questions'])} questions, {len(data['outcomes'])} outcomes, {data['mode']}")
    except (ValueError, json.JSONDecodeError) as err:
        sys.exit(f"✗ Validation failed: {err}")
    print(f"All {len(paths)} quiz file(s) passed structural checks. Run npm test for scoring-path tests.")


if __name__ == "__main__":
    main()
