# Dompet Prasetyo — Anggaran Keluarga November 2026

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457) [![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/xeraaGH/best-household-budget-site-20261126-1457-e2/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457) [![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/xeraaGH/best-household-budget-site-20261126-1457-e2/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

**Entry #2 for “Make the best household budget site”** (`best-household-budget-site-20261126-1457`).
A working household budget site that runs offline from its own static files — desktop and phone.

## The household

Keluarga Prasetyo — Budi & Ayu Prasetyo, Nadia (9) and Raka (6) — renting in Bandung.
November 2026, take-home pay **Rp 8.500.000**.

## The question, and the answer

> **Ke mana perginya Rp 8,5 juta sebulan?**

- Terpakai **Rp 6.600.000** (44 dated transactions, 9 categories)
- Ditabung **Rp 1.500.000** (dana darurat, liburan Pangandaran, laptop Nadia)
- Buffer **Rp 400.000** (disisihkan, tidak terpakai)
- 6.600.000 + 1.500.000 + 400.000 = **8.500.000** — every rupiah reconciles.

The finding: groceries fell **22%** vs October (Rp 2.370.000 → Rp 1.850.000) after the
weekly shop moved to Pasar Cihapit with Sunday meal planning — saving Rp 520.000
without cutting the family's meals. Total spending fell from Rp 7.420.000 (October)
to Rp 6.600.000 (November), down 11%.

## The pages (hash-routed, every page reachable by a link)

| Page | What it does |
|---|---|
| **Dasbor** `#/dashboard` | Stat cards, hand-rolled SVG donut + legend, top 5 expenses, latest transactions, upcoming bills |
| **Transaksi** `#/transaksi` | All 44 transactions in a table, working category filter with live count + totals, working add-transaction form |
| **Anggaran** `#/anggaran` | Spent-vs-budget bars for all 9 categories, with % and remaining/over per category |
| **Tagihan** `#/tagihan` | 8 bills — 6 paid in November with dates, 2 due in December; unpaid bills have a working “Tandai lunas” button |
| **Tujuan** `#/tujuan` | 3 savings goals with real targets and deadlines, plus a working top-up form |
| **Laporan** `#/laporan` | October-vs-November grouped bar chart, weekly spending bars, month summary table, 3 lessons |

## Figures (all computed from the transaction list in `app/data.js`)

| Category | November | Budget | October |
|---|---:|---:|---:|
| Belanja | 1.850.000 | 2.000.000 | 2.370.000 |
| Sewa Rumah | 1.800.000 | 1.800.000 | 1.800.000 |
| Transport | 600.000 | 650.000 | 640.000 |
| Listrik & Air | 450.000 | 500.000 | 480.000 |
| Sekolah Anak | 700.000 | 750.000 | 720.000 |
| Makan di Luar | 500.000 | 600.000 | 620.000 |
| Kesehatan | 300.000 | 350.000 | 260.000 |
| Hiburan | 250.000 | 300.000 | 310.000 |
| Lainnya | 150.000 | 200.000 | 220.000 |
| **Total** | **6.600.000** | **7.150.000** | **7.420.000** |

Weekly spending: 1–7 Nov Rp 3.425.000 (rent + school fees land in week 1), 8–14 Nov Rp 989.000,
15–21 Nov Rp 1.046.000, 22–30 Nov Rp 1.140.000.

## How to run

```sh
# serve app/ with any static server, e.g.
node serve.js            # serves app/ at http://localhost:8080
# or: python3 -m http.server --directory app 8080
```

Then open http://localhost:8080 — no build step, no network requests, system fonts only,
hand-rolled SVG charts, no libraries.

## Hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) first validates the dossier figures —
44 transactions totalling Rp 6.600.000, reconciling with income — then copies `app/`
and `screenshots/` to the output directory and writes `dossier.json` with the kit's
`vendor/makefun-frontend.ts` (copied from the kit unchanged).

## Files

- `app/index.html` — shell, navigation, footer
- `app/style.css` — ledger-paper design (cream, deep green, terracotta)
- `app/data.js` — household, 44 transactions, 9 categories, bills, goals, lessons
- `app/charts.js` — hand-rolled SVG donut and bar charts
- `app/app.js` — hash router and the six page renderers
- `main.ts` — hand-in program (validates figures, builds the dossier)
- `prompt.txt` — the competition description, verbatim from the kit
- `screenshots/` — real renders of this site
