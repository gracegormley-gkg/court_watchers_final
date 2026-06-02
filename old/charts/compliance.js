// §04 — Consent Decree compliance. One stacked horizontal bar per Consent Decree
// section. From left to right: Full (darkest), Secondary, Preliminary, None (red).
// Sorted so largest sections (most ¶s) sit at top. Accountability & Transparency
// is the highlighted row.
// Source: Independent Monitoring Report 13 (Apr 14, 2026), covering Jul 1 –
// Dec 31, 2025. https://cpdmonitoringteam.com/
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Section, total ¶s assessed, then exclusive counts at each final compliance level.
// Numbers extracted from IMR-13 section-by-section summaries.
const SECTIONS = [
  { id: "AT", name: "Accountability & Transparency",  n: 139, none: 7,  pre: 15, sec: 72, full: 45 },
  { id: "UF", name: "Use of Force",                    n: 96,  none: 0,  pre: 3,  sec: 47, full: 46 },
  { id: "TR", name: "Training",                        n: 68,  none: 2,  pre: 26, sec: 31, full: 9  },
  { id: "CI", name: "Crisis Intervention",             n: 66,  none: 4,  pre: 28, sec: 26, full: 8  },
  { id: "IS", name: "Investigatory Stops",             n: 57,  none: 12, pre: 35, sec: 5,  full: 5  },
  { id: "DC", name: "Data Collection & Management",    n: 42,  none: 1,  pre: 25, sec: 10, full: 6  },
  { id: "OW", name: "Officer Wellness & Support",      n: 36,  none: 0,  pre: 2,  sec: 19, full: 15 },
  { id: "CP", name: "Community Policing",              n: 35,  none: 0,  pre: 3,  sec: 23, full: 9  },
  { id: "IP", name: "Impartial Policing",              n: 29,  none: 0,  pre: 11, sec: 15, full: 3  },
  { id: "SV", name: "Supervision",                     n: 29,  none: 2,  pre: 23, sec: 2,  full: 2  },
  { id: "RH", name: "Recruitment, Hiring & Promotion", n: 12,  none: 0,  pre: 5,  sec: 4,  full: 3  },
];

const HIGHLIGHT = "AT";

const LEVELS = [
  { key: "full", label: "Full",        fill: "var(--ink)",         opacity: 1.0  },
  { key: "sec",  label: "Secondary",   fill: "var(--ink)",         opacity: 0.55 },
  { key: "pre",  label: "Preliminary", fill: "var(--ink)",         opacity: 0.22 },
  { key: "none", label: "None",        fill: "var(--blood)",       opacity: 1.0  },
];

export function renderCompliance(selector) {
  const container = document.querySelector(selector);
  container.innerHTML = "";

  const data = SECTIONS.map((s) => {
    const segs = LEVELS.map((L) => ({ ...L, count: s[L.key] }));
    return { ...s, segs };
  });

  const W = container.clientWidth || 980;
  const isNarrow = W < 720;

  const rowH = isNarrow ? 56 : 44;
  const rowGap = 6;
  const M = { top: 60, right: isNarrow ? 24 : 56, bottom: 60, left: isNarrow ? 110 : 230 };
  const H = M.top + data.length * (rowH + rowGap) + M.bottom;
  const innerW = W - M.left - M.right;

  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("role", "img");

  svg.append("title").text("Consent decree compliance by section");
  svg
    .append("desc")
    .text(
      "Eleven horizontal bars, one per section of the Chicago Police consent decree. Each bar is split into segments showing the share of paragraphs at full, secondary, preliminary, and no compliance, as of December 31, 2025. The Accountability and Transparency row is highlighted."
    );

  // ---- Header: scale ticks + legend --------------------------------------
  const x = d3.scaleLinear().domain([0, 1]).range([0, innerW]);

  const headG = svg.append("g").attr("transform", `translate(${M.left},${M.top - 28})`);

  // Top tick marks (0 / 25 / 50 / 75 / 100)
  [0, 0.25, 0.5, 0.75, 1].forEach((p) => {
    headG
      .append("line")
      .attr("x1", x(p))
      .attr("x2", x(p))
      .attr("y1", 12)
      .attr("y2", data.length * (rowH + rowGap) + 16)
      .attr("stroke", "var(--rule)")
      .attr("stroke-dasharray", "2 3")
      .attr("stroke-width", 0.5);
    headG
      .append("text")
      .attr("x", x(p))
      .attr("y", 4)
      .attr("text-anchor", p === 0 ? "start" : p === 1 ? "end" : "middle")
      .attr("class", "axis-tick")
      .style("text-transform", "uppercase")
      .text(`${Math.round(p * 100)}%`);
  });

  // ---- One row per section ------------------------------------------------
  const rowsG = svg.append("g").attr("transform", `translate(0,${M.top})`);

  data.forEach((d, i) => {
    const yRow = i * (rowH + rowGap);
    const g = rowsG.append("g").attr("transform", `translate(0,${yRow})`);

    const isHL = d.id === HIGHLIGHT;

    // Section label (left)
    g.append("text")
      .attr("x", M.left - 14)
      .attr("y", rowH / 2 - 4)
      .attr("text-anchor", "end")
      .attr("class", "compliance-label")
      .attr("font-weight", isHL ? 700 : 600)
      .text(d.name);

    // Paragraph count below name
    g.append("text")
      .attr("x", M.left - 14)
      .attr("y", rowH / 2 + 11)
      .attr("text-anchor", "end")
      .attr("class", "compliance-sub")
      .text(`${d.n} ¶`);

    // Highlight underline on the AT row
    if (isHL) {
      g.append("rect")
        .attr("x", M.left - 4)
        .attr("y", 0)
        .attr("width", innerW + 8)
        .attr("height", rowH)
        .attr("fill", "var(--paper-shadow)")
        .attr("stroke", "var(--ink)")
        .attr("stroke-width", 1);
    }

    // Stacked segments
    let cum = 0;
    d.segs.forEach((s) => {
      if (s.count === 0) return;
      const frac = s.count / d.n;
      const segX = M.left + x(cum);
      const segW = x(frac);
      cum += frac;

      g.append("rect")
        .attr("x", segX)
        .attr("y", isHL ? 4 : 0)
        .attr("width", Math.max(0.5, segW))
        .attr("height", isHL ? rowH - 8 : rowH)
        .attr("fill", s.fill)
        .attr("fill-opacity", s.opacity)
        .attr("stroke", "var(--paper)")
        .attr("stroke-width", 1);

      // Inline % label if segment wide enough
      const pct = Math.round(frac * 100);
      if (segW > 36) {
        const dark = s.key === "full" || s.key === "none";
        g.append("text")
          .attr("x", segX + segW / 2)
          .attr("y", rowH / 2 + 4)
          .attr("text-anchor", "middle")
          .attr("class", "compliance-pct")
          .attr("fill", dark ? "var(--paper)" : "var(--ink)")
          .attr("font-weight", 600)
          .text(`${pct}%`);
      }
    });
  });

  // ---- Legend (bottom) ----------------------------------------------------
  const legendG = svg
    .append("g")
    .attr("transform", `translate(${M.left},${M.top + data.length * (rowH + rowGap) + 26})`);

  const legend = [
    { label: "Full compliance",        fill: "var(--ink)",         opacity: 1.0 },
    { label: "Secondary",              fill: "var(--ink)",         opacity: 0.55 },
    { label: "Preliminary",            fill: "var(--ink)",         opacity: 0.22 },
    { label: "None",                   fill: "var(--blood)",       opacity: 1.0 },
  ];

  let lx = 0;
  legend.forEach((L) => {
    const swatch = 12;
    legendG
      .append("rect")
      .attr("x", lx)
      .attr("y", -10)
      .attr("width", swatch)
      .attr("height", swatch)
      .attr("fill", L.fill)
      .attr("fill-opacity", L.opacity)
      .attr("stroke", "var(--ink)")
      .attr("stroke-width", 0.5);
    const t = legendG
      .append("text")
      .attr("x", lx + swatch + 6)
      .attr("y", -1)
      .attr("class", "axis-tick")
      .style("text-transform", "uppercase")
      .text(L.label);
    lx += swatch + 6 + estimateWidth(L.label) + 22;
    // bounding box for next position is approximate; estimateWidth gets us close
    void t;
  });

  container.append(svg.node());
}

// Rough character-width estimate for legend layout (mono ~6.5px/char at 11px)
function estimateWidth(s) {
  return s.length * 6.5;
}
