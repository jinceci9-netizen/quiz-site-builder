# Mainland-China-ready by design (Cloudflare Pages first)

This is a **best-effort engineering checklist, not a guarantee** that a free overseas-hosted site will always load in China. Cloudflare's standard global network does not include its mainland China Network nodes, so cross-border links have latency and reliability variation. Cloudflare China Network is an Enterprise add-on with ICP / content-review requirements.

## Build a self-contained static site

- Bundle JS, CSS, JSON, small images, icons and decorative assets locally via Vite. Refer to images in `/public` or `src/assets`, not third-party hostnames.
- Do not add remotely loaded `@import` CSS, Google Fonts, foreign-hosted fonts, icons, image hotlinks, JavaScript CDNs or iframe-only core flows.
- Prefer system fonts: `PingFang SC`, `Microsoft YaHei`, `Songti SC` and sans-serif/serif fallbacks. If bundling custom fonts, first verify licensing and actual file size; never download copyright fonts without a license.
- Quiz scoring, progress and share image should work without a remote API. Store non-sensitive progress locally with safe fallback; do not send answers to analytics unless disclosed and permitted.
- Provide a useful loading/empty/error state. Avoid mandatory cloud captcha in the critical path.
- Use Cloudflare Pages root-path `base: '/'`; built assets should use same-origin URLs.

## Audit before shipping

```bash
python3 <skill-root>/scripts/audit_mainland_assets.py <website-root>
cd <website-root>
npm test
npm run build
```

The audit is a **static heuristic**: it flags common remote dependencies; it cannot prove every image, font or API request is local, and it cannot test cross-border reachability. Review the browser's Network tab for all actual requests; validate site when throttled (Fast 3G / Slow 4G as available).

## Mainland acceptance checklist

Before sending a URL to users:

1. Verify HTTPS certificate and custom-domain DNS are actually active; URLs must not still redirect to an unrelated preview hostname.
2. In China mainland, test at least mobile data on China Mobile, China Unicom and China Telecom where practical; test multiple provinces/regions, common Android and iOS browsers and WeChat built-in browser if targeting social sharing.
3. Check first page, every question, answer persistence, completion, result PNG, copy-share URL and reload. Inspect image and font requests as well as HTML reachability.
4. Log: test date/time, network/provider, device/browser, region, loaded OK or not, time to interactive / visible delays, errors. User or a mainland tester must perform these actual checks.
5. If accessibility/latency remains poor, be explicit about the limitation. A custom domain may be appropriate but is **not a guaranteed fix**. Consider ICP-compliant mainland hosting or an appropriate service if guaranteed mainland reachability matters.

### Compliance notes

Website operators must assess the applicable ICP filing/licensing and any security/privacy/other obligations for their hosting location and service type. A site hosted only overseas is not automatically identical to a mainland-hosted site; avoid making categorical legal claims about when filings are mandatory. The official Cloudflare China Network ICP guide describes the requirements for hosting/delivering on mainland infrastructure. This Skill is not legal advice.

Docs:
- https://developers.cloudflare.com/support/troubleshooting/general-troubleshooting/geographic-traffic-routing/
- https://developers.cloudflare.com/china-network/concepts/icp/
- https://developers.cloudflare.com/china-network/get-started/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
