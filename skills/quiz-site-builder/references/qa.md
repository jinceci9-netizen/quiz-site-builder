# Product and Cloudflare release checklist

- [ ] Co-creation: creative angles, 2–3 sample questions, visual choices and report draft offered; decisions recorded and design accepted/delegated, or explicit automatic mode used. No repeated questions; no more than 1–2 key questions per stage.
- [ ] Scope: topic, audience, type, plausible result expectations, legal rights to media.
- [ ] Data: unique question IDs; sane option counts; all scored axes exist; outcome entries complete.
- [ ] Logic: deterministic tie rules; reachable results; survival early, middle and final branches tested.
- [ ] UX: progress, back, resume, restart, keyboard controls, touch interaction and 320–375px responsive layouts.
- [ ] Results: distinct insight, 3:4 readable PNG, share URL and honest preview mode.
- [ ] Privacy: no surprise tracking, secrets, login, collection of sensitive responses.
- [ ] Mainland: same-origin JS/CSS/assets, no mandatory remote CDN/Google Fonts/overseas APIs; run the asset-audit script and inspect Network tab.
- [ ] Engineering: quiz validator, unit tests and Vite build pass; no console errors after user flow.
- [ ] GitHub: generated test site has its **own** repository, with package-lock committed if generated; do not confuse it with the Skill repo.
- [ ] Cloudflare: Pages Git integration to website repo, `main`, `npm run build`, `dist`, site root set correctly, own-domain HTTPS active.
- [ ] Production: compare public URL and all assets in desktop/mobile; real mainland provider/device checks performed or clearly marked 'pending'.
- [ ] Access code: NOT added by default. If requested, use a server-side design; never ship public code lists.
- [ ] Honesty: clearly separate checks actually executed from those that require user accounts, domain access or mainland-network tests.
