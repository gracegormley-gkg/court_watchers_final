// §03 — The Inversion. Centerpiece chart. Two stacked panels:
//   Top: stacked horizontal bar showing officer-counts per band (12,444 vs 11)
//   Bottom: 7-dot ramp, x = band, y = avg discipline rate. Dot size = total complaints.
//   A hand-drawn arrow ties the first and last dot together.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderInversion(selector, data) {
  const container = document.querySelector(selector);
  container.innerHTML = "";

  // Defensive: cast numerics in case autoType missed any.
  const bands = data.map((d) => ({
    band: d.complaint_band,
    n: +d.n_officers,
    total: +d.total_complaints,
    disc: +d.avg_disciplined,
  }));

  const W = container.clientWidth || 980;
  const isNarrow = W < 720;
  const H = isNarrow ? 720 : 520;

  const M = { top: 40, right: 32, bottom: 60, left: 32 };
  const topPanelH = isNarrow ? 220 : 130;
  const gap = isNarrow ? 60 : 40;
  const bottomPanelTop = M.top + topPanelH + gap;
  const bottomPanelH = H - bottomPanelTop - M.bottom;

  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("role", "img");

  svg.append("title").text("The accountability inversion: discipline rate drops as complaint counts rise");
  svg
    .append("desc")
    .text(
      "Two panels. Top: a stacked horizontal bar showing how many officers fall in each complaint band — 12,444 with 1-5 complaints down to 11 with 100+. Bottom: a seven-dot ramp showing average discipline rate per band, falling from 12.7% to 4.3%. The final dot is highlighted in blood-red."
    );

  // =========================================================================
  // TOP PANEL — stacked horizontal bar of officer counts
  // =========================================================================
  const innerW = W - M.left - M.right;
  const totalOfficers = d3.sum(bands, (d) => d.n);

  const topG = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

  topG
    .append("text")
    .attr("x", 0)
    .attr("y", -16)
    .attr("class", "axis-tick")
    .style("text-transform", "uppercase")
    .text("WHO IS IN EACH BAND →");
  topG
    .append("text")
    .attr("x", innerW)
    .attr("y", -16)
    .attr("text-anchor", "end")
    .attr("class", "axis-tick")
    .style("text-transform", "uppercase")
    .text(`${totalOfficers.toLocaleString()} OFFICERS`);

  // Compute segment widths
  let cum = 0;
  const segs = bands.map((b) => {
    const x0 = (cum / totalOfficers) * innerW;
    cum += b.n;
    const x1 = (cum / totalOfficers) * innerW;
    return { ...b, x0, x1, w: x1 - x0 };
  });

  const barH = 56;
  // Ink intensity scales with band severity
  const inkScale = d3
    .scaleLinear()
    .domain([0, bands.length - 1])
    .range([0.55, 1]);

  topG
    .selectAll("rect.stack-segment")
    .data(segs)
    .join("rect")
    .attr("class", "stack-segment")
    .attr("x", (d) => d.x0)
    .attr("y", 0)
    .attr("width", (d) => Math.max(1, d.w))
    .attr("height", barH)
    .attr("fill", (d, i) => (i === bands.length - 1 ? "var(--blood)" : "var(--ink)"))
    .attr("fill-opacity", (d, i) => (i === bands.length - 1 ? 1 : inkScale(i)));

  // Band labels: inside if wide enough, otherwise above with leader
  segs.forEach((s, i) => {
    const isLast = i === segs.length - 1;
    const wide = s.w > 60;
    const cx = (s.x0 + s.x1) / 2;
    if (wide) {
      topG
        .append("text")
        .attr("class", "stack-label")
        .attr("x", cx)
        .attr("y", barH / 2 - 2)
        .attr("text-anchor", "middle")
        .attr("font-family", "var(--mono)")
        .style("text-transform", "uppercase")
        .attr("letter-spacing", "0.08em")
        .text(s.band);
      topG
        .append("text")
        .attr("class", "stack-label")
        .attr("x", cx)
        .attr("y", barH / 2 + 14)
        .attr("text-anchor", "middle")
        .attr("font-family", "var(--mono)")
        .attr("font-size", 10.5)
        .attr("opacity", 0.78)
        .text(s.n.toLocaleString());
    } else {
      // Leader up to a label above the bar
      const labelY = isLast ? -34 : -22;
      const labelX = isLast ? Math.min(innerW, s.x1 + 4) : cx;
      const anchor = isLast ? "end" : "middle";

      topG
        .append("path")
        .attr("d", `M${cx},0 L${cx},${labelY + 6} L${labelX},${labelY + 6}`)
        .attr("fill", "none")
        .attr("stroke", isLast ? "var(--blood)" : "var(--ink)")
        .attr("stroke-width", 0.7);
      topG
        .append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", anchor)
        .attr("class", "stack-label stack-label--outside")
        .attr("font-family", "var(--mono)")
        .attr("font-size", 11)
        .style("text-transform", "uppercase")
        .attr("fill", isLast ? "var(--blood)" : "var(--ink)")
        .text(`${s.band}: ${s.n.toLocaleString()}`);
    }
  });

  // Caption beneath top bar
  topG
    .append("text")
    .attr("x", 0)
    .attr("y", barH + 22)
    .attr("class", "axis-tick")
    .style("text-transform", "uppercase")
    .text("BANDED BY TOTAL COMPLAINTS PER OFFICER");

  // =========================================================================
  // BOTTOM PANEL — discipline ramp
  // =========================================================================
  const bottomG = svg.append("g").attr("transform", `translate(${M.left},${bottomPanelTop})`);

  // Gutter reserved on the left for the y-axis (baseline, ticks, labels, rotated title)
  const axisGutter = 64;

  const x = d3
    .scalePoint()
    .domain(bands.map((b) => b.band))
    .range([axisGutter + 16, innerW - 20])
    .padding(0.5);

  const y = d3
    .scaleLinear()
    .domain([0, 15])
    .range([bottomPanelH - 40, 20]);

  // Radius from total_complaints, sqrt scale for area
  const r = d3
    .scaleSqrt()
    .domain([0, d3.max(bands, (d) => d.total)])
    .range([4, 22]);

  const yTicks = [0, 5, 10, 15];

  // Horizontal grid lines (start at axis gutter, extend right)
  const gridG = bottomG.append("g").attr("class", "grid");
  yTicks.forEach((v) => {
    gridG
      .append("line")
      .attr("class", "band-rule")
      .attr("x1", axisGutter)
      .attr("x2", innerW)
      .attr("y1", y(v))
      .attr("y2", y(v));
  });

  // Y-axis: vertical baseline, outward ticks, right-aligned labels in the gutter
  const yAxisG = bottomG.append("g").attr("class", "y-axis");
  yAxisG
    .append("line")
    .attr("class", "axis-base")
    .attr("x1", axisGutter)
    .attr("x2", axisGutter)
    .attr("y1", y(0))
    .attr("y2", y(d3.max(yTicks)))
    .attr("stroke", "var(--ink)")
    .attr("stroke-width", 1);

  yTicks.forEach((v) => {
    yAxisG
      .append("line")
      .attr("x1", axisGutter - 5)
      .attr("x2", axisGutter)
      .attr("y1", y(v))
      .attr("y2", y(v))
      .attr("stroke", "var(--ink)")
      .attr("stroke-width", 1);
    yAxisG
      .append("text")
      .attr("x", axisGutter - 9)
      .attr("y", y(v))
      .attr("dy", "0.32em")
      .attr("text-anchor", "end")
      .attr("class", "axis-tick")
      .style("text-transform", "uppercase")
      .text(`${v}%`);
  });

  // Rotated y-axis title
  yAxisG
    .append("text")
    .attr("transform", `translate(${axisGutter - 48},${(y(0) + y(d3.max(yTicks))) / 2}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .attr("class", "axis-tick")
    .style("text-transform", "uppercase")
    .style("letter-spacing", "0.14em")
    .attr("fill", "var(--ink)")
    .text("Avg discipline rate");

  // Connecting line
  const line = d3
    .line()
    .x((d) => x(d.band))
    .y((d) => y(d.disc))
    .curve(d3.curveCatmullRom.alpha(0.5));

  bottomG.append("path").attr("class", "ramp-line").attr("d", line(bands));

  // Dots
  bottomG
    .selectAll("circle.ramp-dot")
    .data(bands)
    .join("circle")
    .attr("class", (d, i) => (i === bands.length - 1 ? "ramp-dot ramp-dot--blood" : "ramp-dot"))
    .attr("cx", (d) => x(d.band))
    .attr("cy", (d) => y(d.disc))
    .attr("r", (d) => r(d.total));

  // Per-band labels under dots
  bottomG
    .selectAll("text.band-label")
    .data(bands)
    .join("text")
    .attr("class", "band-label axis-tick")
    .attr("x", (d) => x(d.band))
    .attr("y", bottomPanelH - 16)
    .attr("text-anchor", "middle")
    .style("text-transform", "uppercase")
    .text((d) => d.band);

  bottomG
    .append("text")
    .attr("x", x(bands[0].band) - 12)
    .attr("y", bottomPanelH + 2)
    .attr("text-anchor", "start")
    .attr("class", "axis-tick")
    .style("font-style", "italic")
    .style("text-transform", "none")
    .text("← fewer complaints");
  bottomG
    .append("text")
    .attr("x", x(bands[bands.length - 1].band) + 12)
    .attr("y", bottomPanelH + 2)
    .attr("text-anchor", "end")
    .attr("class", "axis-tick")
    .style("font-style", "italic")
    .style("text-transform", "none")
    .text("more complaints →");

  // Percent labels on first and last dot — the headline numbers
  const first = bands[0];
  bottomG
    .append("text")
    .attr("class", "ramp-callout-num")
    .attr("x", x(first.band))
    .attr("y", y(first.disc) - r(first.total) - 14)
    .attr("text-anchor", "middle")
    .text(`${first.disc}%`);

  const last = bands[bands.length - 1];
  bottomG
    .append("text")
    .attr("class", "ramp-callout-num ramp-callout-num--blood")
    .attr("x", x(last.band))
    .attr("y", y(last.disc) - r(last.total) - 14)
    .attr("text-anchor", "middle")
    .text(`${last.disc}%`);

  container.append(svg.node());
}
