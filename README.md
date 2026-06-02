# Can Chicago's worst police misconduct cases be handled behind closed doors?

A journalism piece on the Illinois Supreme Court case that will decide whether arbitration hearings for the most serious Chicago police discipline cases can be shielded from the public.

**By April Arabian, Grace Gormley, Caroline Gould and Sol Thomas — 06/02/2026.**

## The story in five sections

1. **The case.** A 2024 lower-court ruling lets officers facing termination or suspensions over 365 days choose private arbitration instead of a Chicago Police Board hearing. The Illinois Supreme Court will decide whether those arbitration hearings must remain public. Twenty-one cases are stalled as of Dec. 31, 2025.
2. **The system / the decree.** How CPD discipline actually works — CCPSA, COPA, Police Board, Superintendent, BIA — and the 2019 federal consent decree under which CPD remains in full compliance with only 25 % of the decree's requirements.
3. **An embedded oversight timeline** of every civilian-oversight body Chicago has built since 1961 (Police Board, OPS, IPRA, COPA, Consent Decree, CCPSA + District Councils).
4. **Burge → TIRC.** Decades of CPD torture under former commander Jon Burge, the survivors' organizing that produced the Illinois Torture Inquiry & Relief Commission in 2009, and where its case backlog stands now.
5. **Kicker.** Heather Cherone of WTTW News on whether the new accountability structures will prevent the next big scandal.

## Files

| File | Purpose |
|---|---|
| `index.html` | Article source. Open via a local server (it loads styles and images by relative path). |
| `styles.css` | Stylesheet. Georgia + system sans, white background, full-bleed hero, collapsible `<details>` timeline. |
| `images/` | Hero photo (closed courtroom doors by April Arabian), Clements demonstration photo, and Caroline Gould's TIRC timeline graphic. |
| `bundle.mjs` | Node build script. Run `node bundle.mjs` to produce `court-watchers-article.html`. |
| `court-watchers-article.html` | **Single-file shareable build.** All CSS and images are inlined as base64, so this file double-clicks open in any browser without needing the rest of the folder. ~3.6 MB. |
| `old/` | Archive of the earlier data-dossier draft — D3 charts, CSV datasets, the simple-code notebooks, source PNGs, and the draft PDF. Not part of the active site. |

## Running locally

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000/
```

To regenerate the standalone bundle after editing `index.html`, `styles.css`, or anything in `images/`:

```bash
node bundle.mjs
```

## Sources

- Independent Monitoring Team — [cpdmonitoringteam.com](https://cpdmonitoringteam.com/) — quarterly consent-decree compliance reports.
- Community Commission for Public Safety & Accountability — [ccpsa.chicago.gov](https://ccpsa.chicago.gov/) — accountability history, ECPS ordinance text.
- Civilian Office of Police Accountability — [chicagocopa.org](https://www.chicagocopa.org/) — COPA jurisdiction and investigation categories.
- Chicago Police Board — [chicago.gov/cpb](https://www.chicago.gov/city/en/depts/cpb.html) — Police Board composition and process.
- Interviews with **Max Caproni** (Chicago Police Board), **Heather Cherone** (WTTW News), **Frank Chapman** (CAARPR), **Mark Clements**, **Paul Haidle** (Illinois TIRC) and **Jennifer Crespo** (Illinois TIRC), conducted May 2026.
