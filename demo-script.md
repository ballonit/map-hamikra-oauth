# מפת המקרא — תסריט קצר לסרטון ההגשה

המטרה: להראות שלושה workflows אמיתיים של האפליקציה, תוך פחות משתי דקות ובלי לפתוח כלי תחזוקה או מחקר פרטיים.

## 1. טקסט + provenance

Prompt:

`הציגי את דברים לב 8 ב-MT/WLC עם מקור ופרובננס.`

להראות במסך:
- הפעלת `verse_text`.
- הטקסט העברי של Deut.32.8.
- זיהוי MT/WLC / OSHB v2.2 ופרטי provenance.

## 2. השוואת עדי נוסח מופרדת

Prompt:

`השווי את דברים לב 8 בין MT, LXX ו-Vulgate ושמרי כל עד בנפרד.`

להראות במסך:
- הפעלת `compare_witnesses`.
- MT, LXX ו-Vulgate כרשומות נפרדות.
- edition / source / mapping / provenance.
- שאין טענה אוטומטית על Hebrew Vorlage מתוך הבדל תרגומי.

## 3. חיפוש construction דטרמיניסטי

Prompt:

`מצאי במקרא צירופים צמודים של H1121 ואחריו H430 או H410, בכל הקריאות.`

להראות במסך:
- הפעלת `token_sequence_search`.
- exact adjacency, same verse, max_gap=0.
- התוצאות, token IDs, readings, pagination/exhaustive metadata.

## סיום

להציג במשפט אחד: מפת המקרא היא MCP ציבורי לקריאה בלבד; מקורות research-only שאינם מורשים לפרסום אינם מוחזרים דרך הכלים הציבוריים.

אין צורך להראות Supabase Dashboard, credentials, service-account details, logs, OAuth tokens או כלי import/maintenance בסרטון.