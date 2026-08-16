# מפת המקרא — ערכי הגשה ל-OpenAI

גרסת הגשה: **1.0.0**

## App / Plugin Info

- Package name: `map-hamikra`
- Display name: `מפת המקרא`
- Short description: `חיפוש והשוואת עדי נוסח`
- Developer name: `Ballonit / Mapa HaMikra`
- Category: `Education & Research`
- Website: `https://ballonit.github.io/map-hamikra-oauth/about.html`
- Privacy: `https://ballonit.github.io/map-hamikra-oauth/privacy.html`
- Terms: `https://ballonit.github.io/map-hamikra-oauth/terms.html`
- Support: `https://ballonit.github.io/map-hamikra-oauth/support.html`
- Production MCP type: `Universal`
- Production MCP: `https://map-hamikra-mcp.ballonitforyou.workers.dev/mcp`
- Upstream backend (not submitted): `https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-mcp`
- Authentication: none for the public read-only MCP
- Logo: `assets/logo.svg`

## Long description

מפת המקרא היא כלי מחקר וחינוך לקריאה, חיפוש והשוואה של טקסטים מקראיים. היא מספקת טקסט וטוקנים של MT/WLC, חיפוש לקסיקלי ומורפולוגי, חיפוש ביטויים ורצפי טוקנים מדויקים, בדיקת זמינות והשוואה של עדי נוסח ותרגומים, פתרון הבדלי מספור פסוקים ופרובננס מפורט. עדי הנוסח נשמרים בנפרד, מקורות שאינם מורשים לפרסום אינם נחשפים, והמערכת אינה מסיקה Hebrew Vorlage אוטומטית מהבדלי תרגום.

## Capabilities

1. MT/WLC verse text and OSHB tokens with provenance.
2. Lemma, morphology, phrase, and exact token-sequence search.
3. Separated publication-cleared witness comparison.
4. Cross-versification reference resolution.
5. Dataset coverage, license, and capability reporting.

## Starter prompts

1. `הציגי את דברים לב 8 ב-MT/WLC עם מקור ופרובננס.`
2. `השווי את דברים לב 8 בין MT, LXX ו-Vulgate ושמרי כל עד בנפרד.`
3. `מצאי במקרא צירופים צמודים של H1121 ואחריו H430 או H410.`

## Release notes — 1.0.0

Initial public release of Map HaMikra. Adds read-only biblical corpus research across MT/WLC with token-level provenance, lexical and morphology search, exact phrase and token-sequence search, publication-gated witness comparison, versification resolution, and dataset/license capability reporting. Witness sources remain separated, restricted research-only texts are not exposed through the public MCP, and translation differences do not trigger automatic Vorlage inference.

## MCP review package

`chatgpt-app-submission.json` contains the 13-tool annotation review, exactly five positive test cases, and exactly three negative test cases.

## Verified before portal submission — 2026-08-16

- Production MCP `initialize`: PASS.
- Production MCP `tools/list`: PASS; 13 public read-only tools are exposed.
- `verse_text` on Deuteronomy 32:8: PASS.
- `compare_witnesses` on MT/LXX/Vulgate: PASS; witnesses remained separate.
- `token_sequence_search` exact-adjacency query: PASS; deterministic pagination returned.
- Invalid reference handling: PASS; returned a bounded tool error.
- Restricted-source leakage test: PASS; blocked Targum Neofiti returned `SOURCE_UNAVAILABLE` with null text.
- `dataset_capabilities` MCP `tools/call`: PASS; dynamic research readiness is returned in both text content and structuredContent.
- Public Website / Privacy / Terms / Support URLs: HTTP 200.
- Logo asset exists.
- Public plugin has no login requirement and exposes no Sheet-write tool.

## Cloudflare deployment verified — 2026-08-16

The free Cloudflare Worker is live at `https://map-hamikra-mcp.ballonitforyou.workers.dev/mcp`. External checks passed for health, MCP initialize, 13-tool discovery, SSE transport, Deuteronomy 32:8 verse retrieval, MT/LXX/Vulgate comparison, exact token-sequence search, invalid-reference handling, and the publication gate for Targum Neofiti. Core result fields matched the upstream MCP; only per-request retrieval timestamps differed as expected.

The Worker exposes only `/mcp`, local health routes, and the exact OpenAI challenge route; rejects arbitrary paths and non-MCP JSON-RPC bodies; preserves SSE; strips unnecessary infrastructure headers; and has dependency-free safety tests. The challenge route is intentionally unset and returns `503` until the OpenAI portal supplies the exact verification token.

No Supabase custom domain, Cloudflare paid plan, paid rate limiting, KV, D1, Durable Objects, Queues, or other paid dependency was enabled.
## Portal-only items still required

1. Submitter must have **Apps Management → Write** in the publishing OpenAI organization (organization owners already have it).
2. Select a verified developer or business identity matching the public listing.
3. Create the draft as **With MCP** and choose **Universal** MCP URL.
4. Use `https://map-hamikra-mcp.ballonitforyou.workers.dev/mcp` as the final Universal MCP URL.
5. Run **Scan Tools** and review the 13 discovered tools, then copy the portal-generated domain-verification token into the Worker secret `OPENAI_APPS_CHALLENGE` and verify the exact challenge response.
6. Select availability countries/regions.
7. Review the imported five positive and three negative tests, starter prompts, release notes, and policy attestations, then submit for review.

A demo video is not listed as a required material in the current OpenAI plugin submission documentation.

Do not change the final production MCP URL after Scan Tools/domain verification without rescanning and re-verifying the endpoint.
