---
name: quiz-site-builder
description: >-
  Create, improve or deploy mobile-first interactive quiz websites from natural language:
  Chinese personality/character matching, survival/story, strengths tests,
  question banks, deterministic scoring, shareable results, validation, GitHub
  source publication and Cloudflare Pages deployment. Use when the user wants
  to build an online test or quiz. No payment or card codes by default.
display_name: 互动测试网站生成器
display_name_en: Quiz Site Builder
description_zh: 将测试创意变成完整的题库、评分逻辑、手机端网页与可分享结果，并引导通过 GitHub 和 Cloudflare Pages 上线。
description_en: Build publishable quizzes with scoring, results, mobile UI and Cloudflare Pages guidance.
version: 0.3.0
author: Quiz Site Builder Contributors
examples_zh:
  - 帮我做一个10题的古风宫廷生存测试，部署到Cloudflare Pages。
  - 帮我做国风人格测评，设计16个人格和结果分享卡。
  - 为我检查测试网站的评分逻辑和大陆访问准备情况。
examples_en:
  - Build a Chinese story survival quiz and guide Cloudflare Pages deployment.
  - Design a personality quiz with shareable result cards.
---

# Quiz Site Builder — Portable Agent Skill

Co-create a quiz concept with the user, then turn the agreed design into a polished, tested, Cloudflare Pages-ready website. This Skill follows the vendor-neutral Agent Skills folder format; never require any specific Agent product or vendor-specific tool. Always distinguish **GitHub source hosting** from **Cloudflare website deployment**; the Skill's own repository and each generated quiz site's repository are distinct.

## Read this first

1. Inspect the user's working directory before touching files. Do not overwrite existing projects, files, settings, or deployments.
2. During co-creation, propose rather than silently fix the mechanism; confirm or accept delegation before full implementation:
   - **personality / character matching:** dimensions → deterministic type/character matching; explain tie handling.
   - **survival / interactive story:** ordered decisions → tracked state variables and checkpoints → reachable endings.
   - **diagnostic / strengths:** natural ease + drains + peak experiences → interpretable strengths and actions.
3. Read `references/quiz-design.md` for questions, results and score balancing. Read `references/visual-and-copy.md` for thematic writing and design. Read `references/mainland-readiness.md` before choosing fonts, images or dependencies. Read `references/qa.md` before declaring completion. Read `references/publishing.md` for **Cloudflare Pages via GitHub** when asked to deploy.
4. At the approved development stage, starting from scratch: **copy** the complete `assets/starter/` into a fresh website directory; never modify the reusable starter directly. The starter includes 3 example quizzes, a typed scoring engine, responsive views and result sharing. Customize `src/data/*.json` before editing components.
5. **No paywall by default.** Never introduce payment, card codes, Cloudflare Workers, authentication, D1 or KV unless the user asks. If access codes are requested, read `references/access-codes-optional.md` and guide the user through a secure architecture; do not silently implement it or deploy billable services.

## Default mode: 用户参与共创

Default to co-creation, even when the initial request says “制作网站” or lists development tasks. First clarify the creative direction; do not immediately generate a complete question bank, copy the starter, or build the full site. Reuse choices already given by the user instead of asking them again. Inspecting existing files and preparing bounded proposals is allowed.

Move through these three stages in order, normally one stage per response. Each stage offers concrete recommendations and asks at most 1–2 key questions in total; do not repeat a question already answered. Use ordinary chat on every Agent; optional forms must never be required.

1. **探索创意** — Offer 2–3 meaningfully different angles on the user's topic, each with a hook, audience and distinguishing experience. Favor a distinctive player tension and a memorable, honestly shareable result, not unsupported claims of virality. If the user explicitly requests a different number (e.g. five ideas), honor it rather than forcing 2–3. Recommend one and explain why. Ask which angle to develop, with at most one additional question that materially changes the concept.
2. **设计测试** — Present the proposed algorithm in plain language (state/dimensions, how choices affect them, checkpoints/ties and how endings are selected), result types and differences, plus 2–3 complete sample questions with options and explained tradeoffs. Recommend a mechanism that fits the confirmed angle; ask whether to adopt it or change the key tradeoff. Samples are proposals, not the full bank.
3. **确定风格** — Offer 2–3 concrete visual directions with palette, typography, phone flow and 3:4 share-card treatment; recommend one. Show a representative result-report draft including title, interpretation, strength, cost and advice. Ask for the visual choice and final approval of the consolidated design, at most two questions. Do not begin full development until the user confirms the design or explicitly delegates the remaining decisions.

At the end of every stage, display a concise **决策记录**: confirmed choices, AI recommendations still awaiting confirmation, and remaining decisions. Record delegated/skipped choices as “AI决定” or “跳过，采用建议”, never as a user-selected preference. Carry this record forward in chat; after approval save it to the generated site's `docs/DESIGN.md`. When a user revises a decision, update the record and revisit only materially affected proposals, not all stages.

At every stage the user may revise, skip it, or ask AI to decide. “跳过这一步” delegates that stage only: record the recommended default and proceed to the next stage. “你决定剩下的” delegates all remaining choices: briefly record the selected design and continue to implementation. Silence or elapsed time is not approval. When input is required, stop at the relevant stage; do not treat a missing response as permission to build.

### One-click mode / 一键生成

When the user says “直接做”, “一键生成”, “你来决定”, or explicitly asks to skip all design discussion and build immediately, switch to one-click mode for the current request. State the chosen defaults and proceed autonomously through content, logic, UI, validation and local preview without the three conversational gates. Existing user constraints still apply. The user may switch back to co-creation at any time. A clear prior design approval also allows autonomous development without repeating the stages.

Design approval or one-click mode authorizes the requested development and debugging, not unrelated external actions. Preserve the requested local-only boundary; GitHub publication and Cloudflare deployment still require user intent and available authorization.

## End-to-end workflow

### 1. Convert the user's idea into a usable product spec

In co-creation mode, complete the three stages above and consolidate their decision record before implementation. In one-click mode, choose and briefly state these defaults without waiting. Include one-sentence hook, audience, number of questions (default ~10–16), result classes, mechanism, tradeoffs, theme / color direction, mobile flow and share-card idea. If not specified, default to a free, anonymous, static site with progress locally saved. Do not ask again about confirmed choices; in co-creation mode label proposed defaults until accepted or delegated. Never describe entertainment personality tests as scientific diagnoses.

### 2. After design approval or delegation, write the quiz content and logic before UI

Autonomously provide the full bank, not placeholder samples, and implement/debug the approved site without asking for routine technical decisions. Use narrative questions with plausible non-obvious options. Keep `src/data/*.json` the canonical quiz data. For each personality/diagnostic option, reference only declared axes. For survival, `danger` and `influence` must be finite integer state effects, episodes ordered, and multiple endings realistically reachable. Test paths to failure and success; prevent an 'always choose safest answer' exploit. For licensed media / named works, separate verifiable plot facts from invented situations. Consult reliable sources or user-supplied references before claiming real chronology; if unavailable, state the gap and propose an original alternative for the user to choose. Do not treat a request for a named work as permission to copy its images, dialogue or promotional assets. Check usage rights and do not fabricate exact plot chronology.

### 3. Build attractive, China-aware static UI

Default to Vite + React + TypeScript from the starter, **with `base: '/'`** for Cloudflare Pages. Preserve: one-question-at-a-time view, progress, back, resume, restart, keyboard support, phones 320px+, share-link preview and 3:4 share-card export. Avoid runtime dependencies on Google Fonts, remote image CDNs, third-party scripts/SDKs, overseas APIs and client-side analytics. Bundle static assets; use safe system-font fallback. Never commit keys or put API secrets in frontend code. Make results deterministic. No payment/codes by default.

### 4. Validate for function and mainland-readiness

Execute, adjusting paths:

```bash
python3 <skill-root>/scripts/validate_quizzes.py <website>/src/data
python3 <skill-root>/scripts/audit_mainland_assets.py <website>
cd <website>
npm install
npm test
npm run build
```

Then manually verify intro, back and forward, refresh/resume, multiple outcome paths, share PNG/URL, mobile layout and contrast. See `references/qa.md`. Do not claim any check that you did not run. Do not claim mainland accessibility without tests on actual mainland networks.

### 5. 引导上线 — Publish code to GitHub, deploy website with Cloudflare Pages

After local preview, explain in plain language that GitHub stores code and Cloudflare Pages makes the site accessible online; guide account or dashboard steps when tools cannot do them. Respect local-only requests and ask no repeat authorization where already granted. Follow `references/publishing.md`. Default route: separate GitHub repository for the **generated site** → Cloudflare Pages **Connect to Git** → Vite/React `npm run build` / `dist` / production `main` → deploy → set up a **custom domain** for promotion → test HTTPS / load from mainland networks before claiming readiness. The GitHub Action in starter is only **checks**; Cloudflare's Git integration handles deployment.

If the user wants to publish the Skill itself to GitHub, publish this cross-Agent Skill repository separately. Never create accounts, buy domains, connect repositories, push, or deploy without user intent and available auth. If unavailable, give actionable commands and dashboard steps, not a fake 'published' claim. Cloudflare Pages standard global plan cannot guarantee mainland China reachability; if hard requirement fails tests, recommend compliant mainland-hosting options / ICP as appropriate. Do not confuse Cloudflare's Enterprise China Network with free Pages.

## Product principle

AI 负责拓展创意的可能性，用户负责决定作品的独特性，AI 负责把决定变成现实。 Creative choices belong to the user unless delegated; routine technical execution belongs to the Agent. A narrow delegation such as “配色你来决定” applies only to that decision, not to all remaining stages.

## Core invariants

- Accurate algorithm with reachable, distinguishable results; no random result unless requested.
- No fake clinical validity; no blanket 'China accessible' promise.
- No unsolicited backend, login, tracking, payment, code gate, or sensitive collection.
- Code sharing is not deployment. New quiz website should have its own repository and domain.
- Frontend-only code locks are not secure. If access-code gating is requested, advise server-side verification and handling of secret results; keep it optional.
- Follow the user's existing branding, visuals, facts and choices.

## Invocation examples

- “用 quiz-site-builder 和我共创一个宫廷生存测试，先给我几个创意切口。”
- “直接做一个10题原创宫廷生存测试，本地预览，不部署。”（一键生成）


- “用 $quiz-site-builder 帮我做国风人格测试，六衡分析、器物人格、手机端，并部署到 Cloudflare Pages。”
- “做10题原创宫廷生存测试，分支结局、3:4结果卡，发布到 GitHub 后由 Cloudflare 自动上线。”
- “帮我把测试网站准备给国内用户用，不依赖国外字体或 CDN，教我绑定自定义域名并检查访问。”
- “我暂时不需要收费或卡密，只告诉我之后怎么扩展卡密。”

## Cross-agent execution rules

- All instructional paths such as `references/quiz-design.md` and `assets/starter/` are relative to the folder containing **this** `SKILL.md` (`<skill-root>`), never to a hard-coded Codex directory.
- Use the file operations, shell and browser capabilities **actually offered by the current host agent**; do not assume `apply_patch`, Codex tools, or a particular MCP server exist. When a tool is absent, provide portable commands or manual steps and clearly mark unfinished steps.
- The project source of truth is `skills/quiz-site-builder/`. Never duplicate or fork the skill logic into provider-specific copies. Adapter installation only copies the same folder.
- Codex invocation may use `$quiz-site-builder`; WorkBuddy, Claude Code, CodeBuddy Code and other agents may use a skill picker or ordinary language. Do not require `$` syntax outside Codex.
- Never claim an agent supports a feature merely because it imports the Skill. Confirm local file access, Python, Node/npm, Git and ability to authenticate before running deployment steps.
- WorkBuddy import uses a zip with a `quiz-site-builder/SKILL.md` folder root. WorkBuddy should load `references/`, `scripts/`, and `assets/` from that folder. If the host sandbox prevents running scripts, explain limitations and still generate the static site code.

## Deployment constraints by host

Regardless of agent: GitHub stores source, Cloudflare Pages is the default deployment destination; use Cloudflare Git integration where the user can authorize it. The optional card-code architecture is guidance only; never silently add paywalls, payment or secret-containing frontend checks. Mainland-China access requires real-world tests and cannot be guaranteed by standard Cloudflare Pages or custom domains.
