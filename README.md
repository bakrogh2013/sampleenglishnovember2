# Canvas Embed Starter (Password-Gated)
This starter lets you:
1) Host a story page (`story1.html`) on Netlify.
2) Gate it behind a password using a serverless function (`netlify/functions/check.js`).
3) Embed the gate (`gate.html`) directly into Canvas with an `<iframe>` (no external logins).

## Quick Start (Netlify)
1. **Create a new repo** on GitHub and upload this folder's contents.
2. **Connect repo to Netlify** (New site from Git, pick your repo). Build command: *(none)*. Publish directory: `.`
3. In Netlify → **Site settings → Environment variables**, add:
   - `PASSWORDS_JSON` with value like: `{"codes":["alpha1","beta2","charlie3"],"cookieHours":8}`
4. Deploy the site. Note your site URL, e.g. `https://your-site.netlify.app`
5. Open `https://your-site.netlify.app/gate.html` in a browser to test:
   - Enter one of your codes, click **Open story**.
   - If valid, the story iframe appears.

## Embed in Canvas
1. In a Canvas **Page**, switch to the **HTML Editor**.
2. Paste:
   ```html
   <iframe 
     src="https://YOUR-SITE.netlify.app/gate.html" 
     width="100%" height="650" style="border:0;" allow="clipboard-read; clipboard-write">
   </iframe>
   ```
3. Save. Students will see a small code box; on success the content appears.

> **Important cookie note:** Because the content is in an iframe on a different domain than Canvas, the session cookie must be set with `SameSite=None; Secure`. This starter does that by default in `check.js`.

## Files
- **gate.html** — Minimal gate UI shown to students, fetches `/api/check` (via Netlify redirect) and, on success, reveals the story iframe.
- **simple_gate.html** — Pure client-only gate (not secure). Use only for quick prototyping.
- **story1.html** — Your actual ESL story, audio, and HTML-only questions.
- **netlify/functions/check.js** — Validates password server-side. Reads `PASSWORDS_JSON` env var. Sets a short-lived cookie.
- **netlify.toml** — Routes `/api/check` to the serverless function and enables basic headers.

## Managing Passwords
Set environment variable `PASSWORDS_JSON`, e.g.:
```
{"codes":["alpha1","alpha2","alpha3"], "cookieHours": 8}
```
- **codes**: array of allowed codes (you can list 50+).
- **cookieHours**: how long access lasts before requiring the code again.

To **lock the site** quickly: set `PASSWORDS_JSON` to `{"codes":[]}` or add an env var `SITE_ACTIVE=false` (see code) and redeploy.

## Per‑School Locking (optional)
Extend `check.js` to verify a `schoolId` and consult a database (Airtable/Supabase/etc.). If status ≠ active, return 403. Your Canvas embed can append a `?schoolId=SLCC` query param to `gate.html` and forward it to the function.

## Vercel Instead of Netlify
Use `api/check.js` with a default export (slightly different handler signature) and remove `netlify.toml`. The HTML files work the same.

## Accessibility & WCAG Notes
- `story1.html` uses proper headings, alt text placeholders, and transcript link for audio.
- Keep all interactions keyboard reachable. Avoid drag-only widgets inside the story; pair with Canvas New Quizzes for grading.
