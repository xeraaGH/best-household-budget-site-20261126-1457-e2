// Dompet Prasetyo — figures for November 2026.
// One household, one month, every rupiah accounted for:
//   take-home Rp 8.500.000 = spent Rp 6.600.000 + saved Rp 1.500.000 + buffer Rp 400.000
// All category totals below are the exact sums of the 44 transactions listed here.

export const HOUSEHOLD = {
  name: "Keluarga Prasetyo",
  members: "Budi & Ayu Prasetyo, Nadia (9) dan Raka (6)",
  home: "Rumah kontrakan di Bandung",
  month: "November 2026",
  income: 8500000,
  saved: 1500000,
  buffer: 400000,
};

export const CATEGORIES = [
  { id: "belanja",  label: "Belanja",        color: "#2e6b4f", budget: 2000000, oct: 2370000 },
  { id: "sewa",     label: "Sewa Rumah",     color: "#8a5a2b", budget: 1800000, oct: 1800000 },
  { id: "transport",label: "Transport",      color: "#3d7a8c", budget: 650000,  oct: 640000 },
  { id: "listrik",  label: "Listrik & Air",  color: "#d9a441", budget: 500000,  oct: 480000 },
  { id: "sekolah",  label: "Sekolah Anak",   color: "#6a5a9e", budget: 750000,  oct: 720000 },
  { id: "makan",    label: "Makan di Luar",  color: "#c05b2e", budget: 600000,  oct: 620000 },
  { id: "sehat",    label: "Kesehatan",      color: "#a03d5a", budget: 350000,  oct: 260000 },
  { id: "hiburan",  label: "Hiburan",        color: "#4a7d3a", budget: 300000,  oct: 310000 },
  { id: "lainnya",  label: "Lainnya",        color: "#6b6f66", budget: 200000,  oct: 220000 },
];

// 44 dated November transactions. Category sums:
// belanja 1.850.000 · sewa 1.800.000 · transport 600.000 · listrik 450.000
// sekolah 700.000 · makan 500.000 · sehat 300.000 · hiburan 250.000 · lainnya 150.000
// Total spent: Rp 6.600.000
export const TRANSACTIONS = [
  { date: "2026-11-01", desc: "Sewa rumah November",        cat: "sewa",      amount: 1800000 },
  { date: "2026-11-01", desc: "Pasar Cihapit — belanja mingguan", cat: "belanja", amount: 320000 },
  { date: "2026-11-02", desc: "Bensin motor",               cat: "transport", amount: 60000 },
  { date: "2026-11-02", desc: "Pulsa Budi",                 cat: "lainnya",   amount: 30000 },
  { date: "2026-11-03", desc: "SPP Nadia (kelas 3 SD)",     cat: "sekolah",   amount: 350000 },
  { date: "2026-11-03", desc: "SPP Raka (kelas 1 SD)",      cat: "sekolah",   amount: 250000 },
  { date: "2026-11-03", desc: "Super Indo — susu & roti",   cat: "belanja",   amount: 145000 },
  { date: "2026-11-04", desc: "Warteg — sarapan",           cat: "makan",     amount: 35000 },
  { date: "2026-11-05", desc: "Token listrik 200 kWh",      cat: "listrik",   amount: 200000 },
  { date: "2026-11-05", desc: "Pulsa Ayu",                  cat: "lainnya",   amount: 30000 },
  { date: "2026-11-06", desc: "Apotek — vitamin keluarga",  cat: "sehat",     amount: 75000 },
  { date: "2026-11-06", desc: "GoRide Budi ke kantor",      cat: "transport", amount: 45000 },
  { date: "2026-11-07", desc: "Mie ayam sekeluarga",        cat: "makan",     amount: 85000 },
  { date: "2026-11-08", desc: "Pasar Cihapit — belanja mingguan", cat: "belanja", amount: 335000 },
  { date: "2026-11-08", desc: "Langganan streaming keluarga", cat: "hiburan", amount: 54000 },
  { date: "2026-11-09", desc: "Bensin motor",               cat: "transport", amount: 60000 },
  { date: "2026-11-10", desc: "Super Indo — buah & sayur",  cat: "belanja",   amount: 120000 },
  { date: "2026-11-10", desc: "Sabun & deterjen",           cat: "lainnya",   amount: 25000 },
  { date: "2026-11-11", desc: "Buku & alat tulis Nadia",    cat: "sekolah",   amount: 60000 },
  { date: "2026-11-12", desc: "Tagihan PDAM",               cat: "listrik",   amount: 150000 },
  { date: "2026-11-13", desc: "Warteg — makan siang",       cat: "makan",     amount: 40000 },
  { date: "2026-11-14", desc: "Parkir & tol",               cat: "transport", amount: 75000 },
  { date: "2026-11-14", desc: "Mainan edukasi Raka",        cat: "hiburan",   amount: 70000 },
  { date: "2026-11-15", desc: "Pasar Cihapit — belanja mingguan", cat: "belanja", amount: 310000 },
  { date: "2026-11-15", desc: "Dokter gigi Nadia",          cat: "sehat",     amount: 125000 },
  { date: "2026-11-16", desc: "Ayam geprek sekeluarga",     cat: "makan",     amount: 90000 },
  { date: "2026-11-16", desc: "Potong rambut Raka",         cat: "lainnya",   amount: 20000 },
  { date: "2026-11-17", desc: "Super Indo — bekal sekolah", cat: "belanja",   amount: 135000 },
  { date: "2026-11-17", desc: "Buku cerita Nadia",          cat: "hiburan",   amount: 46000 },
  { date: "2026-11-18", desc: "Bensin motor",               cat: "transport", amount: 60000 },
  { date: "2026-11-19", desc: "Les renang Raka",            cat: "sekolah",   amount: 40000 },
  { date: "2026-11-20", desc: "Token listrik",              cat: "listrik",   amount: 100000 },
  { date: "2026-11-21", desc: "Bakso sekeluarga",           cat: "makan",     amount: 120000 },
  { date: "2026-11-22", desc: "Pasar Cihapit — belanja mingguan", cat: "belanja", amount: 300000 },
  { date: "2026-11-22", desc: "Apotek — obat batuk",        cat: "sehat",     amount: 55000 },
  { date: "2026-11-23", desc: "Sewa film — nonton bareng",  cat: "hiburan",   amount: 35000 },
  { date: "2026-11-24", desc: "Super Indo — camilan",       cat: "belanja",   amount: 85000 },
  { date: "2026-11-24", desc: "Pulsa Budi",                 cat: "lainnya",   amount: 30000 },
  { date: "2026-11-25", desc: "Servis motor",               cat: "transport", amount: 300000 },
  { date: "2026-11-27", desc: "Vitamin anak",               cat: "sehat",     amount: 45000 },
  { date: "2026-11-28", desc: "Nasi padang sekeluarga",     cat: "makan",     amount: 130000 },
  { date: "2026-11-29", desc: "Pasar Cihapit — belanja mingguan", cat: "belanja", amount: 100000 },
  { date: "2026-11-29", desc: "Mainan edukasi Nadia",       cat: "hiburan",   amount: 45000 },
  { date: "2026-11-30", desc: "Biaya admin bank",           cat: "lainnya",   amount: 15000 },
];

// 8 bills: 6 paid in November with dates, 2 due in December.
export const BILLS = [
  { name: "Sewa rumah",          amount: 1800000, due: "2026-11-01", paid: "2026-11-01", note: "Kontrakan, dibayar awal bulan" },
  { name: "SPP Nadia",           amount: 350000,  due: "2026-11-03", paid: "2026-11-03", note: "Kelas 3 SD" },
  { name: "SPP Raka",            amount: 250000,  due: "2026-11-03", paid: "2026-11-03", note: "Kelas 1 SD" },
  { name: "Token listrik",       amount: 200000,  due: "2026-11-05", paid: "2026-11-05", note: "200 kWh" },
  { name: "Langganan streaming", amount: 54000,   due: "2026-11-08", paid: "2026-11-08", note: "Paket keluarga" },
  { name: "Tagihan PDAM",        amount: 150000,  due: "2026-11-12", paid: "2026-11-12", note: "Air bulan Oktober" },
  { name: "Internet rumah",      amount: 250000,  due: "2026-12-05", paid: null,         note: "50 Mbps, jatuh tempo 5 Desember" },
  { name: "Iuran RT & sampah",   amount: 50000,   due: "2026-12-10", paid: null,         note: "Jatuh tempo 10 Desember" },
];

// 3 savings goals. November's Rp 1.500.000 saving is split across these.
export const GOALS = [
  { id: "darurat",  name: "Dana Darurat",                 target: 5000000, saved: 3200000, deadline: "Maret 2027",    note: "6 bulan pengeluaran pokok, untuk jaga-jaga." },
  { id: "liburan",  name: "Liburan ke Pangandaran",       target: 3000000, saved: 1450000, deadline: "Juni 2027",     note: "Liburan pertama sekeluarga ke pantai." },
  { id: "laptop",   name: "Laptop untuk Nadia",           target: 4500000, saved: 900000,  deadline: "Desember 2027", note: "Untuk belajar dan tugas sekolah." },
];

export const LESSONS = [
  {
    title: "Pasar menang lawan supermarket",
    body: "Belanja mingguan pindah ke Pasar Cihapit plus rencana makan tiap Minggu malam. Belanja turun dari Rp 2.370.000 (Oktober) jadi Rp 1.850.000 — hemat Rp 520.000, atau 22%, tanpa mengurangi porsi makan keluarga.",
  },
  {
    title: "Makan di luar bukan musuhnya — impulsif yang iya",
    body: "Makan di luar turun dari Rp 620.000 jadi Rp 500.000. Bukan karena berhenti jajan: keluarga tetap makan bakso dan nasi padang bareng, tapi warteg dadakan di hari kerja diganti bekal dari rumah.",
  },
  {
    title: "Buffer Rp 400.000 itu bukan sisa — itu rencana",
    body: "Setiap bulan Rp 400.000 disisihkan sebagai buffer sebelum dihitung sebagai sisa. Bulan ini buffer tidak terpakai: servis motor Rp 300.000 sudah masuk anggaran transport, bukan diambil dari tabungan.",
  },
];

export function categoryTotals(transactions) {
  const totals = {};
  for (const c of CATEGORIES) totals[c.id] = 0;
  for (const t of transactions) totals[t.cat] = (totals[t.cat] ?? 0) + t.amount;
  return totals;
}

export function totalSpent(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function weeklyTotals(transactions) {
  const weeks = [
    { label: "1–7 Nov", total: 0 },
    { label: "8–14 Nov", total: 0 },
    { label: "15–21 Nov", total: 0 },
    { label: "22–30 Nov", total: 0 },
  ];
  for (const t of transactions) {
    const day = Number(t.date.slice(8, 10));
    const idx = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3;
    weeks[idx].total += t.amount;
  }
  return weeks;
}

export function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

export function formatShort(n) {
  if (n >= 1000000) return "Rp " + (n / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " jt";
  return "Rp " + (n / 1000).toLocaleString("id-ID") + " rb";
}

export function formatDateID(iso) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const [y, m, d] = iso.split("-").map(Number);
  return d + " " + months[m - 1] + " " + y;
}
