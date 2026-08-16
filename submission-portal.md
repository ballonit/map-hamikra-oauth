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
- Production MCP: `https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-public-mcp`

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

`chatgpt-app-submission.json` contains the complete 13-tool annotation review, exactly five positive test cases, and exactly three negative test cases.

## Portal-only items still required

- Verified OpenAI developer/business identity and submission permission.
- Run **Scan Tools** against the production MCP after the final production deployment.
- Complete the generated MCP domain-verification challenge.
- Provide the demo recording URL.
- Upload the final app logo and select availability countries.

Do not change the production MCP URL after Scan Tools/domain verification without rescanning and re-verifying the final endpoint.
