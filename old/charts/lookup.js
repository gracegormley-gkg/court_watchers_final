// §05 — Lookup. Searchable HTML table over top500_officers.csv.
// Sticky header, monospace numerics, crew badges. Vanilla JS filter on display_name.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function renderLookup(selector, rows) {
  const wrap = document.querySelector(selector);
  const input = document.getElementById("lookup-input");
  const countEl = document.getElementById("lookup-count");

  const norm = (r) => ({
    rank: +r.rank,
    name: r.display_name,
    n: +r.n_complaints,
    sus: +r.n_sustained,
    disc: +r.n_disciplined,
    pctDisc: +r.pct_disciplined,
    ef: +r.n_excessive_force,
    cr: +r.n_civil_rights,
    url: r.cpdp_url,
    burge: String(r.flag_burge).toLowerCase() === "true",
    guevara: String(r.flag_guevara).toLowerCase() === "true",
  });

  const data = rows.map(norm).sort((a, b) => a.rank - b.rank);

  // Build table once
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th class="rank">RANK</th>
        <th>OFFICER</th>
        <th class="num" style="text-align:right">COMPLAINTS</th>
        <th class="num" style="text-align:right">SUSTAINED</th>
        <th class="num" style="text-align:right">DISCIPLINED</th>
        <th class="num" style="text-align:right">DISC. RATE</th>
        <th class="num" style="text-align:right">EXCESS. FORCE</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  wrap.innerHTML = "";
  wrap.append(table);

  function rowHTML(d) {
    const badge = d.burge
      ? `<span class="crew-badge crew-badge--burge">Burge</span>`
      : d.guevara
      ? `<span class="crew-badge crew-badge--guevara">Guevara</span>`
      : "";
    const isCrew = d.burge || d.guevara;
    return `
      <tr class="${isCrew ? "is-crew" : ""}">
        <td class="rank num"><a href="${d.url}" target="_blank" rel="noopener">#${d.rank}</a></td>
        <td class="name">${d.name}${badge}</td>
        <td class="num" style="text-align:right">${d.n}</td>
        <td class="num" style="text-align:right">${d.sus}</td>
        <td class="num" style="text-align:right">${d.disc}</td>
        <td class="num ${isCrew ? "num--blood" : ""}" style="text-align:right">${d.pctDisc.toFixed(1)}%</td>
        <td class="num" style="text-align:right">${d.ef}</td>
      </tr>
    `;
  }

  function render(rowsToShow) {
    if (rowsToShow.length === 0) {
      tbody.innerHTML = `<tr><td class="empty" colspan="7">No officer in the top 500 matches that name.</td></tr>`;
    } else {
      tbody.innerHTML = rowsToShow.map(rowHTML).join("");
    }
    countEl.textContent = rowsToShow.length;
  }

  render(data);

  // Debounced filter
  let t;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (!q) return render(data);
      const filtered = data.filter((d) => d.name.toLowerCase().includes(q));
      render(filtered);
    }, 80);
  });
}
