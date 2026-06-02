# Can Chicago's worst police misconduct cases be handled behind closed doors?

A journalism piece on the Illinois Supreme Court case that will decide whether arbitration hearings for the most serious Chicago police discipline cases can be shielded from the public.

**By April Arabian, Grace Gormley, Caroline Gould and Sol Thomas — 06/02/2026.**

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
