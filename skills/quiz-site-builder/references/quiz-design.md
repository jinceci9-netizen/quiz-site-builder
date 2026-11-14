# Quiz product design and scoring guide

These are **design patterns**, not historical/clinical truth. The historical projects that motivated them include `照见` (20 ancient scenarios, six continua, 16 archetypes, 22 cultural objects), a villain-archetype personality quiz with richer narrative reports, a costume-drama survival quiz with story checkpoints, and a strengths/energy-drain assessment.

## Co-creation before the full bank

Apply SKILL.md's default co-creation flow first. Propose the mechanism, explain scoring and result types in plain language, and show 2–3 complete sample questions with options and tradeoffs. Ask only 1–2 important questions; reuse confirmed decisions. Write the full bank only after the design is accepted or delegated. Explicit one-click requests bypass conversational gates. Honor a requested number of creative ideas; do not force the default 2–3.

For real fictional works, verify plot claims and chronology from reliable sources or user materials; label invented scenarios as original adaptations. If evidence is unavailable, explain the gap and offer alternatives rather than inventing episode facts. Do not assume permission for copyrighted artwork or dialogue.

## A. Personality / artifact matching

- Aim for 8–20 decisions for a consumer MVP; raise question count only if each question adds signal.
- Define 3–6 interpretable axes. E.g. `explore`, `care`, `strategy`; for `照见` the axes were 游·定、显·藏、繁·素、刚·柔、入·逸、恒·幻. Preserve polarities explicitly if adapting to a six-axis scheme.
- Each option contributes a signed or positive integer to 1–3 axes; avoid one obvious 'perfect' option.
- Explain how the result is selected: by dominant axis in the starter; a production project may instead assign archetypes from a multi-dimensional vector using documented centroids or rules. Do not imply 16 result profiles are encoded by just one 3-axis maximum.
- Give each result a headline, specific tension, a concrete everyday behavior, a growth edge, and a small shareable line. If mapping historical artifacts, separate verified artifact history from fictional personality symbolism.
- Test for answer-path variety: run simulations and check every type is attainable. If ties occur, apply a stable, documented rule (starter: first declared axis wins ties).

## B. Survival / branching-story quiz

- Use original scenes or licensed/verified references. Distinguish 'loosely inspired' from actual episode-by-episode continuity.
- Model player state: the starter uses **two** variables, `danger` (excessive exposure) and `influence` (agency), so always choosing the safest answer also has a cost. Complex quizzes may additionally track `trust`, `resources`, or `alliances`. Do not make outcomes purely arbitrary.
- Each question has an increasing `episode`; each option changes `danger` and `influence`. On reaching `dangerLimit`, immediately stop at that episode. At the final episode, a run finishes successfully only when `influence >= minInfluence`. A passive path may reach episode 76 but still receive a middle outcome.
- Ensure at least one route ends early, one mid-way, and one reaches the finale. Make the thematic consequence visible in result copy.
- Don't reward the same 'most cautious' option every time: alternate the costs of confrontation, silence, alliance, and initiative.

## C. Strengths / motivation diagnostic

- Cross-reference natural ease, sources of depletion, and moments of proud accomplishment. These are *signals for reflection*, not standardized psychometric evidence.
- Prefer behavioral scenes rather than 'what are you good at?' self-labels. If interpreting a low score, do not equate it with inability.
- Give a useful next experiment in every result, e.g. try one 45-minute creative sprint or observe a week's energy diary.
- Do not suggest a clinical diagnosis or deterministic career destiny.

## Question writing rubric (0/1 per criterion)

1. A real decision rather than a generic adjective quiz.
2. Options are plausible to an ordinary person, none written as obviously virtuous.
3. Options differ in motivation or tradeoff, not just length.
4. Wording avoids stigmatizing, discriminatory, or overclaiming language.
5. Scoring differences are intentional and auditable.

If 2+ criteria fail, rewrite the question before building the UI.

## Result writing template

- Name: vivid but concise (2–7 Chinese characters works well).
- Hook: one sentence the person would share.
- Interpretation: 80–200 Chinese characters with a specific pattern and tension.
- Strengths: 2–3 concrete behaviors, not empty compliments.
- Growth / suggestion: 1–2 useful experiments or reflective prompts.
- Sharing line: under 30 Chinese characters; never require claiming scientific certainty.

## Data contract

For the bundled starter the source is JSON under `src/data/`:
- `id`, `mode`, `title`, `tagline`, `description`, `theme`, `axes`, `questions`, `outcomes`.
- Question: `id`, `prompt`, optional `scene`, optional `episode` for survival, `options`.
- Option: `id`, `label`, `effects` mapping axis name to integer or `danger` to integer.
- Personality/diagnostic: `outcomes` keys are axis ids; top-scoring axis decides the result.
- Survival: `survival.dangerLimit`, `survival.minInfluence`, `survival.maxEpisode`; options have `effects.danger` and `effects.influence`; outcome keys `early`, `middle`, `final`. Score is summed in question order until risk threshold or final agency check.
- The starter is a **template**: change UI and scoring when the product spec requires 16 archetypes, complex permutations, or narrative branches.
