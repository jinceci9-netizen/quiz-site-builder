# Optional access codes (卡密) — explanation only; NOT enabled by default

This Skill ships a fully free quiz; no paywall, code input or authentication in the starter. Do not add it unless requested.

## When a user asks “可以加卡密吗？”

First distinguish:

- **Convenience code / promo invitation**: not protecting something valuable. A client-only UI can hide content cosmetically, but is trivially bypassable; be transparent.
- **Real code-controlled access**: needs a server-side validation endpoint, secure storage, redemption state, and rate limiting. Merely checking code in React or putting the valid list in a public JS/JSON bundle is insecure.

## Conceptual Cloudflare architecture

Mobile browser → Cloudflare Pages frontend → Pages Function / Worker `/api/redeem` → D1 database or KV / other durable store → server-controlled authorization (session token / HttpOnly Secure SameSite cookie) → **server-side** protected content/API.

- Generate high-entropy random unique codes and store hashed values; avoid sequential guessable codes.
- For one-time codes use atomic redemption transactions/unique constraints (D1 is often a suitable option); KV alone is not a transactional one-time redemption database.
- Ensure repeat submissions / double-clicks / network retries do not consume codes twice unexpectedly.
- Rate limit attempts, prevent leaking whether specific codes belong to users, avoid logging raw codes, and handle expiration/revocation.
- Any genuinely protected report must NOT ship complete in the public frontend source bundle.
- Store credentials as Cloudflare secrets, not in git or `VITE_` client-exposed environment variables.
- Reconcile public-site policies, applicable privacy/security laws, user support and cost before production.

This is not a complete implementation; no payments or automatic delivery are required. If the user explicitly asks for code-gated features, first identify whether codes grant quiz entry, final result, or premium report; then propose a backend design and implement after user confirmation for external/billable resources.

Official docs for follow-up:
- https://developers.cloudflare.com/pages/functions/
- https://developers.cloudflare.com/d1/
