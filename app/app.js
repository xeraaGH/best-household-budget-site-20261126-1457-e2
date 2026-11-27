// Dompet Prasetyo — hash router and page renderers.
// Every page is rendered from data.js; charts come from charts.js.
// User-added transactions and goal top-ups live in memory for this visit.

import {
  HOUSEHOLD, CATEGORIES, TRANSACTIONS, BILLS, GOALS, LESSONS,
  categoryTotals, totalSpent, weeklyTotals,
  formatRupiah, formatShort, formatDateID,
} from "./data.js";
import { donutSVG, barRow, groupedBarsSVG, legendHTML } from "./charts.js";

const app = document.getElementById("app");
const addedTransactions = [];
const goalTopUps = {};
const paidBills = new Set();

function allTransactions() {
  return [...TRANSACTIONS, ...addedTransactions];
}

function catById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? { label: id, color: "#6b6f66" };
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

const ROUTES = {
  "/dashboard": { label: "Dasbor", render: renderDashboard },
  "/transaksi": { label: "Transaksi", render: renderTransactions },
  "/anggaran": { label: "Anggaran", render: renderBudget },
  "/tagihan": { label: "Tagihan", render: renderBills },
  "/tujuan": { label: "Tujuan", render: renderGoals },
  "/laporan": { label: "Laporan", render: renderReport },
};

function navHTML(active) {
  return Object.entries(ROUTES).map(([path, r]) =>
    `<a href="#${path}" class="${path === active ? "active" : ""}">${r.label}</a>`
  ).join("");
}

function statCard(label, value, sub) {
  return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-sub">${sub}</div></div>`;
}

// ---------- Dashboard ----------

function renderDashboard() {
  const txs = allTransactions();
  const spent = totalSpent(txs);
  const totals = categoryTotals(txs);
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: totals[c.id], color: c.color }));
  const top = [...txs].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const latest = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const upcoming = BILLS.filter((b) => !b.paid && !paidBills.has(b.name));
  const savedPct = Math.round((HOUSEHOLD.saved / HOUSEHOLD.income) * 100);

  const legend = CATEGORIES.map((c) =>
    `<li><span class="swatch" style="background:${c.color}"></span>${c.label}<b>${formatShort(totals[c.id])}</b><span class="pct">${Math.round((totals[c.id] / spent) * 100)}%</span></li>`
  ).join("");

  app.innerHTML = `
  <section class="hero">
    <p class="kicker">Anggaran Keluarga · November 2026 · Bandung</p>
    <h1>Ke mana perginya Rp&nbsp;8,5&nbsp;juta sebulan?</h1>
    <p class="lede">Keluarga Prasetyo — Budi &amp; Ayu, Nadia (9) dan Raka (6) — mencatat setiap rupiah
    yang keluar di bulan November. Jawabannya ada di bawah: bukan jajan yang membengkak,
    melainkan belanja mingguan yang berhasil dipangkas.</p>
    <div class="finding"><span class="finding-tag">Temuan bulan ini</span>
      Belanja turun <b>22%</b> dibanding Oktober — dari Rp 2.370.000 jadi Rp 1.850.000 —
      setelah belanja mingguan pindah ke Pasar Cihapit dengan rencana makan tiap Minggu malam.
      Hemat <b>Rp 520.000</b> tanpa mengurangi porsi makan keluarga.</div>
  </section>

  <section class="stats">
    ${statCard("Gaji dibawa pulang", formatRupiah(HOUSEHOLD.income), "Budi & Ayu, November 2026")}
    ${statCard("Terpakai", formatRupiah(spent), Math.round((spent / HOUSEHOLD.income) * 100) + "% dari penghasilan")}
    ${statCard("Ditabung", formatRupiah(HOUSEHOLD.saved), savedPct + "% dari penghasilan")}
    ${statCard("Buffer", formatRupiah(HOUSEHOLD.buffer), "Disisihkan, tidak terpakai bulan ini")}
  </section>

  <div class="grid-2">
    <section class="card">
      <h2>Pengeluaran per kategori</h2>
      <div class="donut-wrap">${donutSVG(slices)}
        <ul class="donut-legend">${legend}</ul>
      </div>
      <p class="card-foot"><a href="#/anggaran">Lihat anggaran tiap kategori &rarr;</a></p>
    </section>

    <section class="card">
      <h2>Pengeluaran terbesar</h2>
      <ol class="ranked">${top.map((t) =>
        `<li><span class="rank-desc">${esc(t.desc)}</span><span class="rank-date">${formatDateID(t.date)}</span><b>${formatRupiah(t.amount)}</b></li>`
      ).join("")}</ol>
      <p class="card-foot"><a href="#/transaksi">Semua ${txs.length} transaksi &rarr;</a></p>
    </section>
  </div>

  <div class="grid-2">
    <section class="card">
      <h2>Transaksi terbaru</h2>
      <ul class="tx-list">${latest.map((t) => `
        <li><span class="dot" style="background:${catById(t.cat).color}"></span>
        <span class="tx-desc">${esc(t.desc)}</span>
        <span class="tx-cat">${catById(t.cat).label}</span>
        <b>${formatRupiah(t.amount)}</b></li>`).join("")}</ul>
    </section>

    <section class="card">
      <h2>Tagihan berikutnya</h2>
      ${upcoming.length ? `<ul class="bill-mini">${upcoming.map((b) => `
        <li><span>${esc(b.name)}</span><span class="due">jatuh tempo ${formatDateID(b.due)}</span><b>${formatRupiah(b.amount)}</b></li>`).join("")}</ul>`
        : `<p class="empty-note">Semua tagihan sudah lunas. Tidak ada tagihan menunggu.</p>`}
      <h2 class="subhead">Tabungan bulan ini</h2>
      <p class="save-line">Rp 1.500.000 masuk ke tiga tujuan keluarga — dana darurat, liburan, dan laptop Nadia.
      <a href="#/tujuan">Lihat progresnya &rarr;</a></p>
    </section>
  </div>`;
}

// ---------- Transactions ----------

let activeFilter = "all";

function renderTransactions() {
  const txs = allTransactions();
  const chips = [`<button data-cat="all" class="${activeFilter === "all" ? "on" : ""}">Semua</button>`]
    .concat(CATEGORIES.map((c) =>
      `<button data-cat="${c.id}" class="${activeFilter === c.id ? "on" : ""}">${c.label}</button>`))
    .join("");

  app.innerHTML = `
  <section class="page-head">
    <h1>Transaksi November</h1>
    <p>${txs.length} transaksi tercatat. Pilih kategori untuk menyaring — jumlah dan total berubah langsung.</p>
  </section>
  <section class="card">
    <div class="filters" id="filters">${chips}</div>
    <p class="filter-total" id="filter-total"></p>
    <div class="table-wrap"><table id="tx-table">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>
      <tbody id="tx-body"></tbody>
    </table></div>
  </section>
  <section class="card">
    <h2>Tambah transaksi</h2>
    <form id="add-form" class="form-grid">
      <label>Tanggal <input type="date" id="f-date" value="2026-11-30" min="2026-11-01" max="2026-11-30" required></label>
      <label>Keterangan <input type="text" id="f-desc" placeholder="cth. Sayur di pasar" maxlength="60" required></label>
      <label>Kategori <select id="f-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")}</select></label>
      <label>Jumlah (Rp) <input type="number" id="f-amount" min="1000" step="500" placeholder="50000" required></label>
      <button type="submit" class="btn">Simpan transaksi</button>
    </form>
    <p class="form-note" id="add-note">Transaksi baru langsung masuk tabel dan mengubah total bulan ini.</p>
  </section>`;

  const body = document.getElementById("tx-body");
  const totalLine = document.getElementById("filter-total");

  function drawTable() {
    const rows = (activeFilter === "all" ? txs : txs.filter((t) => t.cat === activeFilter))
      .slice().sort((a, b) => b.date.localeCompare(a.date) || b.amount - a.amount);
    body.innerHTML = rows.map((t) => `
      <tr><td>${formatDateID(t.date)}</td><td>${esc(t.desc)}</td>
      <td><span class="dot" style="background:${catById(t.cat).color}"></span>${catById(t.cat).label}</td>
      <td class="num">${formatRupiah(t.amount)}</td></tr>`).join("");
    const sum = rows.reduce((s, t) => s + t.amount, 0);
    totalLine.textContent = activeFilter === "all"
      ? `${rows.length} transaksi · total ${formatRupiah(sum)}`
      : `${rows.length} transaksi ${catById(activeFilter).label} · total ${formatRupiah(sum)}`;
  }

  document.getElementById("filters").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    activeFilter = btn.dataset.cat;
    document.querySelectorAll("#filters button").forEach((b) => b.classList.toggle("on", b === btn));
    drawTable();
  });

  document.getElementById("add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById("f-amount").value);
    if (!amount || amount <= 0) return;
    addedTransactions.push({
      date: document.getElementById("f-date").value,
      desc: document.getElementById("f-desc").value.trim(),
      cat: document.getElementById("f-cat").value,
      amount,
    });
    document.getElementById("add-note").textContent =
      `Tersimpan: ${formatRupiah(amount)}. Total bulan ini sekarang ${formatRupiah(totalSpent(allTransactions()))}.`;
    e.target.reset();
    document.getElementById("f-date").value = "2026-11-30";
    drawTable();
  });

  drawTable();
}

// ---------- Budget ----------

function renderBudget() {
  const totals = categoryTotals(allTransactions());
  const maxBudget = Math.max(...CATEGORIES.map((c) => c.budget));
  const rows = CATEGORIES.map((c) => {
    const spent = totals[c.id];
    const pct = Math.round((spent / c.budget) * 100);
    const left = c.budget - spent;
    const status = left >= 0
      ? `<span class="ok">Sisa ${formatRupiah(left)}</span>`
      : `<span class="over">Lebih ${formatRupiah(-left)}</span>`;
    return `<div class="budget-row">
      <div class="budget-head"><span class="dot" style="background:${c.color}"></span><b>${c.label}</b>
      <span>${formatRupiah(spent)} dari ${formatRupiah(c.budget)}</span><span class="budget-pct">${pct}%</span></div>
      ${barRow(c.label, spent, maxBudget, c.color, "")}
      <div class="budget-status">${status}</div>
    </div>`;
  }).join("");

  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0);
  const spent = totalSpent(allTransactions());
  app.innerHTML = `
  <section class="page-head">
    <h1>Anggaran November</h1>
    <p>Anggaran total ${formatRupiah(totalBudget)} · terpakai ${formatRupiah(spent)} ·
    masih tersisa ${formatRupiah(totalBudget - spent)} dari anggaran. Semua kategori di bawah anggaran.</p>
  </section>
  <section class="card"><div class="budget-list">${rows}</div></section>
  <section class="card note-card"><h2>Kenapa anggaran belanja turun?</h2>
    <p>Anggaran belanja November Rp 2.000.000 — lebih rendah dari realisasi Oktober Rp 2.370.000 —
    karena belanja mingguan pindah ke Pasar Cihapit. Realisasinya Rp 1.850.000, jadi masih ada sisa
    Rp 150.000 yang dialihkan ke dana darurat.</p></section>`;
}

// ---------- Bills ----------

function renderBills() {
  const paid = BILLS.filter((b) => b.paid || paidBills.has(b.name));
  const unpaid = BILLS.filter((b) => !b.paid && !paidBills.has(b.name));
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);

  const card = (b) => {
    const isPaid = b.paid || paidBills.has(b.name);
    const paidDate = b.paid ?? (paidBills.has(b.name) ? "2026-11-27" : null);
    return `<article class="bill ${isPaid ? "paid" : "due"}">
      <div class="bill-top"><h3>${esc(b.name)}</h3><span class="stamp">${isPaid ? "LUNAS" : "MENUNGGU"}</span></div>
      <p class="bill-note">${esc(b.note)}</p>
      <div class="bill-amount">${formatRupiah(b.amount)}</div>
      <p class="bill-date">${isPaid ? "Dibayar " + formatDateID(paidDate) : "Jatuh tempo " + formatDateID(b.due)}</p>
      ${isPaid ? "" : `<button class="btn small" data-bill="${esc(b.name)}">Tandai lunas</button>`}
    </article>`;
  };

  app.innerHTML = `
  <section class="page-head">
    <h1>Tagihan</h1>
    <p>${paid.length} dari ${BILLS.length} tagihan lunas (${formatRupiah(paidTotal)}) ·
    ${unpaid.length} menunggu (${formatRupiah(unpaidTotal)}), jatuh tempo Desember.</p>
  </section>
  <section class="bills-grid">${BILLS.map(card).join("")}</section>
  <section class="card note-card"><h2>Cara keluarga ini membayar tagihan</h2>
    <p>Semua tagihan November dibayar paling lambat tanggal 12. Sewa dan SPP dibayar di awal bulan
    supaya tidak tercampur uang belanja. Tagihan Desember — internet dan iuran RT — sudah dicatat
    dari sekarang agar tidak kaget di awal bulan.</p></section>`;

  app.querySelectorAll("button[data-bill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      paidBills.add(btn.dataset.bill);
      renderBills();
    });
  });
}

// ---------- Goals ----------

function renderGoals() {
  const cards = GOALS.map((g) => {
    const saved = g.saved + (goalTopUps[g.id] ?? 0);
    const pct = Math.min(100, Math.round((saved / g.target) * 100));
    const left = Math.max(0, g.target - saved);
    return `<article class="card goal-card">
      <h2>${esc(g.name)}</h2>
      <p class="goal-note">${esc(g.note)}</p>
      <div class="goal-numbers"><b>${formatRupiah(saved)}</b><span>dari ${formatRupiah(g.target)}</span></div>
      <div class="bar-track tall"><div class="bar-fill" style="width:${pct}%;background:#2e6b4f"></div></div>
      <p class="goal-meta">${pct}% tercapai · sisa ${formatRupiah(left)} · target ${esc(g.deadline)}</p>
    </article>`;
  }).join("");

  const savedTotal = GOALS.reduce((s, g) => s + g.saved + (goalTopUps[g.id] ?? 0), 0);
  app.innerHTML = `
  <section class="page-head">
    <h1>Tujuan Menabung</h1>
    <p>Tiga tujuan keluarga, total terkumpul ${formatRupiah(savedTotal)}.
    Tabungan November Rp 1.500.000 dibagi ke ketiganya.</p>
  </section>
  <div class="grid-3">${cards}</div>
  <section class="card">
    <h2>Tambah tabungan</h2>
    <form id="topup-form" class="form-grid">
      <label>Tujuan <select id="g-goal">${GOALS.map((g) => `<option value="${g.id}">${esc(g.name)}</option>`).join("")}</select></label>
      <label>Jumlah (Rp) <input type="number" id="g-amount" min="10000" step="10000" placeholder="100000" required></label>
      <button type="submit" class="btn">Tambah ke tabungan</button>
    </form>
    <p class="form-note" id="topup-note">Pilih tujuan dan jumlah — progres di atas langsung berubah.</p>
  </section>`;

  document.getElementById("topup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("g-goal").value;
    const amount = Number(document.getElementById("g-amount").value);
    if (!amount || amount <= 0) return;
    const goal = GOALS.find((g) => g.id === id);
    goalTopUps[id] = (goalTopUps[id] ?? 0) + amount;
    renderGoals();
    document.getElementById("topup-note").textContent =
      `Ditambahkan ${formatRupiah(amount)} ke ${goal.name}.`;
  });
}

// ---------- Report ----------

function renderReport() {
  const totals = categoryTotals(allTransactions());
  const shortLabel = { "Listrik & Air": "Listrik", "Sekolah Anak": "Sekolah", "Makan di Luar": "Makan", "Kesehatan": "Sehat", "Sewa Rumah": "Sewa" };
  const groups = CATEGORIES.map((c) => ({
    label: shortLabel[c.label] ?? c.label, okt: c.oct, nov: totals[c.id],
  }));
  const series = [
    { key: "okt", label: "Oktober", color: "#b9b2a0" },
    { key: "nov", label: "November", color: "#2e6b4f" },
  ];
  const weeks = weeklyTotals(allTransactions());
  const maxWeek = Math.max(...weeks.map((w) => w.total));
  const octTotal = CATEGORIES.reduce((s, c) => s + c.oct, 0);
  const novTotal = totalSpent(allTransactions());
  const diff = octTotal - novTotal;
  const diffPct = ((diff / octTotal) * 100).toFixed(1);

  app.innerHTML = `
  <section class="page-head">
    <h1>Laporan November</h1>
    <p>Total belanja turun dari ${formatRupiah(octTotal)} (Oktober) jadi ${formatRupiah(novTotal)} —
    hemat ${formatRupiah(diff)} (${diffPct}%). Pengeluaran terbesar bulan ini tetap sewa rumah,
    yang tidak berubah dari bulan lalu.</p>
  </section>

  <section class="card">
    <h2>Oktober vs November, per kategori</h2>
    ${groupedBarsSVG(groups, series)}
    ${legendHTML(series)}
  </section>

  <div class="grid-2">
    <section class="card">
      <h2>Pengeluaran per minggu</h2>
      ${weeks.map((w) => barRow(w.label, w.total, maxWeek, "#2e6b4f", formatRupiah(w.total))).join("")}
      <p class="card-foot">Minggu pertama paling besar karena sewa dan SPP dibayar di awal bulan.</p>
    </section>
    <section class="card">
      <h2>Ringkasan bulan</h2>
      <table class="summary">
        <tr><th></th><th class="num">Oktober</th><th class="num">November</th><th class="num">Selisih</th></tr>
        ${CATEGORIES.map((c) => {
          const d = totals[c.id] - c.oct;
          return `<tr><td>${c.label}</td><td class="num">${formatRupiah(c.oct)}</td><td class="num">${formatRupiah(totals[c.id])}</td><td class="num ${d <= 0 ? "ok" : "over"}">${d <= 0 ? "−" : "+"}${formatRupiah(Math.abs(d))}</td></tr>`;
        }).join("")}
        <tr class="total-row"><td>Total</td><td class="num">${formatRupiah(octTotal)}</td><td class="num">${formatRupiah(novTotal)}</td><td class="num ok">−${formatRupiah(diff)}</td></tr>
      </table>
    </section>
  </div>

  <section class="card">
    <h2>Tiga pelajaran dari November</h2>
    <ol class="lessons">${LESSONS.map((l) => `<li><b>${esc(l.title)}</b><p>${esc(l.body)}</p></li>`).join("")}</ol>
  </section>`;
}

// ---------- Router ----------

function route() {
  const hash = location.hash.replace(/^#/, "") || "/dashboard";
  const entry = ROUTES[hash] ?? ROUTES["/dashboard"];
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + (ROUTES[hash] ? hash : "/dashboard"));
  });
  entry.render();
  window.scrollTo(0, 0);
}

document.getElementById("nav").innerHTML = navHTML("/dashboard");
window.addEventListener("hashchange", route);
route();
