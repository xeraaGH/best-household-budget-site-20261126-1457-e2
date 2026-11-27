// Hand-rolled SVG charts for Dompet Prasetyo — no libraries, no network.
// Donut: one <circle> per category slice, drawn with stroke-dasharray on a
// circle of circumference 2*pi*r. Bars: plain <div> widths, and an SVG grouped
// bar chart for the October-vs-November comparison.

export function donutSVG(slices, size = 220) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const total = slices.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const parts = slices.map((s) => {
    const frac = total === 0 ? 0 : s.value / total;
    const len = Math.max(frac * c - 2, 0);
    const el =
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" ` +
      `stroke-width="34" stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" ` +
      `stroke-dashoffset="${(-offset).toFixed(2)}" />`;
    offset += frac * c;
    return el;
  });
  return (
    `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donat pengeluaran per kategori" class="donut">` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e9e2d2" stroke-width="34" />` +
    parts.join("") +
    `<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">Rp 6,6 jt</text>` +
    `<text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-sub">terpakai di Nov</text>` +
    `</svg>`
  );
}

export function barRow(label, value, max, color, note) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  const shown = typeof value === "number" ? "Rp " + value.toLocaleString("id-ID") : value;
  return (
    `<div class="bar-row"><div class="bar-label">${label}</div>` +
    `<div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>` +
    `<div class="bar-value">${shown}</div>` +
    (note ? `<div class="bar-note">${note}</div>` : "") +
    `</div>`
  );
}

export function groupedBarsSVG(groups, series, size = { w: 640, h: 300 }) {
  const { w, h } = size;
  const padL = 8, padB = 34, padT = 18;
  const maxV = Math.max(1, ...groups.flatMap((g) => series.map((s) => g[s.key])));
  const innerW = w - padL * 2;
  const innerH = h - padT - padB;
  const slot = innerW / groups.length;
  const bw = Math.min(34, slot / (series.length + 1));
  let out = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Perbandingan Oktober dan November" class="chart-svg">`;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH * i) / 4;
    out += `<line x1="${padL}" y1="${y}" x2="${w - padL}" y2="${y}" class="gridline" />`;
  }
  groups.forEach((g, gi) => {
    series.forEach((s, si) => {
      const v = g[s.key];
      const bh = (v / maxV) * innerH;
      const x = padL + gi * slot + (slot - bw * series.length) / 2 + si * bw;
      const y = padT + innerH - bh;
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}" fill="${s.color}" rx="2"><title>${g.label} ${s.label}: Rp ${v.toLocaleString("id-ID")}</title></rect>`;
    });
    const lx = padL + gi * slot + slot / 2;
    out += `<text x="${lx.toFixed(1)}" y="${h - 12}" text-anchor="middle" class="axis-label">${g.label}</text>`;
  });
  out += `</svg>`;
  return out;
}

export function legendHTML(series) {
  return `<div class="legend">` + series.map((s) =>
    `<span class="legend-item"><span class="swatch" style="background:${s.color}"></span>${s.label}</span>`
  ).join("") + `</div>`;
}
