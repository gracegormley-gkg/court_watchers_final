// Bundles index.html + styles.css + chart code + CSV data into a single
// double-click-runnable HTML file at court-watchers-article.html.
//
// Run:  node bundle.mjs
//
// The bundled file uses D3 from the jsdelivr CDN, so it needs internet on
// first load. Everything else is inlined.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), "utf8");

const html = read("index.html");
const css  = read("styles.css");

// Inline every src="images/..." as a base64 data URI so the bundle is a
// truly single-file deliverable.
function inlineImages(htmlSource) {
  return htmlSource.replace(/src="(images\/[^"]+)"/g, (_, relPath) => {
    const buf = readFileSync(join(here, relPath));
    const ext = extname(relPath).slice(1).toLowerCase();
    const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    return `src="data:${mime};base64,${buf.toString("base64")}"`;
  });
}

const bundled = inlineImages(html)
  // Drop the external stylesheet link — we inline it instead
  .replace(
    /<link\s+rel="stylesheet"\s+href="styles\.css">/,
    `<style>\n${css}\n</style>`
  )
  // Replace the module script with a tiny inline section tracker
  .replace(
    /<script\s+type="module"\s+src="main\.js"><\/script>/,
    `<script>
"use strict";
function trackSection() {
  const sectionEl = document.getElementById("file-section");
  if (!sectionEl) return;
  const sections = Array.from(document.querySelectorAll("[data-label]"));
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .forEach((e) => { sectionEl.textContent = e.target.dataset.label; });
    },
    { threshold: [0.15, 0.5, 0.85], rootMargin: "-30% 0px -30% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", trackSection);
} else {
  trackSection();
}
</script>`
  );

const outPath = join(here, "court-watchers-article.html");
writeFileSync(outPath, bundled, "utf8");

const kb = (Buffer.byteLength(bundled, "utf8") / 1024).toFixed(1);
console.log(`Wrote ${outPath} — ${kb} KB`);
