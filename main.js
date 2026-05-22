// ES module entrypoint. Loads each section's data and dispatches to chart renderers.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { renderInversion } from "./charts/inversion.js";
import { renderLookup } from "./charts/lookup.js";

// --- Track which section is on screen → update fixed file label -----------
function trackSection() {
  const sectionEl = document.getElementById("file-section");
  const sections = Array.from(document.querySelectorAll("[data-label]"));

  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .forEach((e) => {
          sectionEl.textContent = e.target.dataset.label;
        });
    },
    { threshold: [0.15, 0.5, 0.85], rootMargin: "-30% 0px -30% 0px" }
  );

  sections.forEach((s) => io.observe(s));
}

// --- Re-render charts on resize (debounced) -------------------------------
function onResize(fn) {
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(fn, 180);
  });
}

// --- Boot -----------------------------------------------------------------
async function boot() {
  trackSection();

  const tasks = [
    {
      load: () => d3.csv("complaint_bands.csv", d3.autoType),
      render: (data) => {
        const r = () => renderInversion("#chart-inversion", data);
        r();
        onResize(r);
      },
      label: "inversion",
    },
    {
      load: () => d3.csv("top500_officers.csv", d3.autoType),
      render: (data) => renderLookup("#chart-lookup", data),
      label: "lookup",
    },
  ];

  await Promise.all(
    tasks.map(async (t) => {
      try {
        const data = await t.load();
        t.render(data);
      } catch (err) {
        console.error(`[${t.label}] failed:`, err);
        const el = document.getElementById(`chart-${t.label}`);
        if (el) {
          el.innerHTML = `<div style="padding:2rem;border:1px dashed var(--rule);color:var(--ink-secondary);font-family:var(--mono);font-size:12px">Could not load chart data. If you opened this file directly, serve it instead:<br>cd "court_watchers_final" &amp;&amp; python3 -m http.server 8000</div>`;
        }
      }
    })
  );
}

boot();
