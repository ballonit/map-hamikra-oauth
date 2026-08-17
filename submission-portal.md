# מפת המקרא — ערכי הגשה ל-OpenAI

גרסת הגשה: **1.0.0**  
Bible Data Engine: **0.9.0**

## App / Plugin Info

- Package name: `map-hamikra`
- Display name: `מפת המקרא`
- Short description: `חיפוש והשוואת שבע מסורות נוסח`
- Developer name: `Ballonit / Mapa HaMikra`
- Category: `Education & Research`
- Publication scope: `RESEARCH_NONCOMMERCIAL_WITH_ATTRIBUTION`
- Website: `https://ballonit.github.io/map-hamikra-oauth/about.html`
- Privacy: `https://ballonit.github.io/map-hamikra-oauth/privacy.html`
- Terms: `https://ballonit.github.io/map-hamikra-oauth/terms.html`
- Support: `https://ballonit.github.io/map-hamikra-oauth/support.html`
- Production MCP type: `Universal`
- Verified backend MCP: `https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-mcp`
- Final submission MCP: pending verified `https://map-hamikra-mcp.<ACCOUNT_SUBDOMAIN>.workers.dev/mcp` deployment
- Authentication: none for the public read-only MCP
- Logo: `assets/logo.svg`

## Long description

מפת המקרא היא כלי מחקר וחינוך חופשי ולא־מסחרי לקריאה, חיפוש והשוואה של טקסטים מקראיים. היא מספקת טקסט וטוקנים של MT/WLC, חיפוש לקסיקלי ומורפולוגי, חיפוש ביטויים ורצפי טוקנים מדויקים, בדיקת זמינות והשוואה נפרדת של MT, DSS, LXX, SP, פשיטתא, תרגומים ארמיים ו-Vulgate, פתרון הבדלי מספור פסוקים ופרובננס מפורט. כתבי־יד ותרגומים נשמרים בנפרד, מקור חסר מקבל status מפורש, והמערכת אינה מסיקה Hebrew Vorlage אוטומטית מהבדלי תרגום.

## Capabilities

1. MT/WLC verse text and OSHB tokens with provenance.
2. Lemma, morphology, phrase, and exact token-sequence search.
3. Separated witness retrieval, availability, and comparison for all seven requested witness families.
4. Manuscript-separated DSS and identity-separated Targum results.
5. Cross-versification reference resolution.
6. Dataset coverage, license, publication scope, and capability reporting.

## Starter prompts

1. `הציגי את דברים לב 8 ב-MT/WLC עם מקור ופרובננס.`
2. `השווי את דברים לב 8–9 בין MT, DSS, LXX, SP, פשיטתא, תרגומים ארמיים ו-Vulgate. הציגי כל עד בנפרד.`
3. `מצאי במקרא צירופים צמודים של H1121 ואחריו H430 או H410.`

## Release notes — 1.0.0

Initial public research release of Map HaMikra on Bible Data Engine 0.9.0. The release adds separated witness retrieval and comparison for MT, DSS, LXX, SP, Peshitta, named Targumim, and Vulgate; explicit availability statuses; DSS manuscript identity and partial-survival handling; SP Torah applicability; source-native text; verified versification mapping; provenance and license metadata; and no automatic Vorlage inference. Public use is limited to noncommercial research and education with source attribution where required.

## MCP review package

`chatgpt-app-submission.json` contains the 13-tool annotation review, exactly five positive test cases, and exactly three negative test cases.

## Verified before portal submission — 2026-08-17

- `WITNESS_MVP_READY=true`.
- `PUBLICATION_LICENSE_OK=true` for the declared noncommercial research scope.
- MT/LXX/DSS/SP/PESHITTA/TARGUMIM/VULGATE: READY.
- Unrestricted commercial publication: false; monetization: false.
- External REST `dataset_capabilities`: PASS.
- MCP `initialize`: PASS; server version 0.9.0.
- MCP `tools/list`: PASS; 13 public read-only tools.
- MCP `tools/call`: PASS.
- Acceptance suite: 9 PASS, 0 FAIL, 0 BLOCKED.
- Deuteronomy 32:8–9: separate MT, DSS manuscripts, LXX, SP, Peshitta, named Targumim, and Vulgate records with status/provenance/license.
- Genesis 14:22: PASS from loaded data.
- SP outside Torah: `NOT_APPLICABLE`.
- DSS verified non-survival fixture: `NOT_SURVIVED`; catalog-not-checked remains distinct.
- DSS partial fixture: `PARTIAL` with surviving text and manuscript ID.
- Verified MT/LXX versification shift: MT 1 Kings 11:5 → LXX 1 Kings 11:6.
- Targum identities remain separate.
- Unloaded named corpus fixture: `SOURCE_UNAVAILABLE` with null text.
- `model_inference_used=false`; automatic Vorlage inference disabled.
- Website, Privacy, Terms, and Support pages rechecked live on 2026-08-17.

## Current submission blocker — Cloudflare authorization and deployment

OpenAI's current public submission requirements mandate domain control verification at the MCP host or an allowed parent origin. The verified Supabase backend cannot serve the required root `/.well-known/openai-apps-challenge` path.

The free Cloudflare Worker source is committed under `cloudflare-worker/`. It exposes only `/mcp`, local health routes, and the exact OpenAI challenge route; rejects arbitrary paths and non-MCP JSON-RPC bodies; preserves SSE; strips unnecessary infrastructure headers; disables preview URLs; and has dependency-free safety tests.

The final `workers.dev` hostname has not been assigned because no authenticated Cloudflare deployment connection is available in the execution environment. The Cloudflare dashboard also presents a human-verification challenge to the cloud browser. Do not run Scan Tools, domain verification, or replace the production MCP field until the Worker is deployed and the full external test matrix passes against the assigned hostname.

No paid infrastructure or Supabase custom domain is required or authorized.

## Portal-only items still required

1. Deploy the prepared Worker on Cloudflare Workers Free and obtain the final `workers.dev/mcp` URL.
2. Create the OpenAI draft as **With MCP**, choose **Universal**, and enter the deployed Worker URL.
3. Use the portal-generated token at the Worker's exact challenge route and complete domain verification.
4. Run **Scan Tools** and verify all 13 tools.
5. Select the verified developer identity, publication regions, policy attestations, and submit for review.
