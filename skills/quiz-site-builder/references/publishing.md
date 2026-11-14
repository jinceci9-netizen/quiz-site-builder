# Publishing: GitHub source + Cloudflare Pages website

Two separate deliverables: (A) open-source cross-Agent Skill repository, and (B) each generated test website. GitHub stores their source; Cloudflare Pages hosts the generated site.

## Publish the Skill to GitHub (not a website deployment)

From the repository root:

```bash
git init -b main
git add .
git commit -m "feat: add quiz site builder skill"
gh auth login
gh repo create quiz-site-builder --public --source=. --push
```

Before acting, confirm the user intends publication and is authenticated. Never claim success without command output. Never push private user data, .env credentials, or personal assets without consent.

## Install the Skill locally

At the Skill repo root on macOS/Linux:

```bash
python3 scripts/install_skill.py --target codex --scope user
```

From the repository root, use `python3 scripts/install_skill.py --target claude --scope user` for Claude Code or `--target codebuddy-cli` for CodeBuddy Code. For WorkBuddy, generate the importable ZIP with `python3 scripts/package.py` and upload it in the Skills UI. See `docs/INSTALL.md`.

## Deploy a quiz website using Cloudflare Pages (default)

1. Copy `assets/starter/` into a **new** website folder. Customize its quiz data and design. The generated site's root must contain `package.json`, `src/`, `.node-version`, `vite.config.ts` and `CLOUDFLARE_DEPLOY.md`.
2. Run `npm install`, `npm test`, `npm run build` and preflight from mainland-readiness guide. Commit `package-lock.json` if created. `dist/` is generated and should not be committed.
3. Create a **separate** GitHub repository for the generated website; push source to `main`.
4. Cloudflare Dashboard → Workers & Pages → Create Pages project → **Connect to Git** → authorize/select website GitHub repository → deploy with:

   | Field | Value |
   |---|---|
   | Framework | React (Vite) / Vite |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Root directory | leave blank (repository root by default) |
   | Production branch | `main` |
   | Node.js | 22 via `.node-version` |

5. Cloudflare gives a preview `*.pages.dev` domain. Use Pages project → **Custom domains** to associate a real domain; follow its certificate/DNS instructions. Root (apex) domains need Cloudflare nameservers; subdomains can use CNAME according to its instructions.
6. Changes pushed to main trigger automatic deployment. Starter's `.github/workflows/check.yml` runs verification only, NOT deployment. GitHub Pages is deliberately not configured.
7. Test final custom-domain HTTPS, all assets, mobile flow, share functions, and China's major network operators. **Do not guarantee China access merely because Cloudflare deploy succeeded.**

For a standalone runbook see `assets/starter/CLOUDFLARE_DEPLOY.md`. Official docs:

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

## Alternative: Wrangler Direct Upload (only if requested)

The default is GitHub integration, not the `wrangler pages deploy` workflow. If the user has a direct-upload Pages project, use `npm run build`, `npx wrangler login`, and `npx wrangler pages deploy dist --project-name=EXACT_PROJECT_NAME`. Do not confuse this with Git-integrated Pages project creation. Cloudflare docs note the initial creation modes are not freely interchangeable.

## Mainland access and compliance

Read `mainland-readiness.md`. Cloudflare Pages default service, even with a custom domain, is **not a guarantee** of stable access from mainland China. Test China Mobile/Unicom/Telecom and multiple provinces; collect actual failures before advising changes. If domestic availability is a strict business SLO, evaluate compliant domestic hosting + applicable ICP requirements. Standard Cloudflare Pages is not the Enterprise China Network. Don't imply a zero-cost one-click mainland acceleration switch.

## Access codes: guidance only

By default build a completely free site. Only when the user requests card-code functionality, introduce `access-codes-optional.md` as an optional architectural guide. Access codes that protect secret content cannot be enforced by an untrusted frontend alone. No payment provider needs to be selected or configured for simple codes.
