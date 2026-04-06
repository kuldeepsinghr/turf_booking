import { useState, useMemo, useEffect } from "react";
import { useBooking } from "../../context/BookingContext";   // ← real context
import Modal from "../../components/dashboard/Modal";
import { Btn } from "../../components/dashboard/UI";

/* ─── tiny helpers ─────────────────────────────────────── */
function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function avatarColor(name = "") {
  const palette = [
    "#6366f1","#8b5cf6","#ec4899","#f59e0b",
    "#10b981","#3b82f6","#ef4444","#14b8a6",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return palette[Math.abs(h) % palette.length];
}
function fmtDate(str = "") {
  try {
    // "YYYY-MM-DD" → parse as local date to avoid UTC shift (IST +05:30)
    const [y, m, d] = str.split("-").map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      });
    }
    return new Date(str).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return str; }
}
function fmtAmount(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

/* ─── status config ────────────────────────────────────── */
const STATUS_CFG = {
  confirmed: {
    label: "Confirmed",
    dot:   "bg-emerald-400",
    badge: "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20",
    ring:  "ring-emerald-500/30",
  },
  cancelled: {
    label: "Cancelled",
    dot:   "bg-red-400",
    badge: "bg-red-500/12 text-red-400 border border-red-500/20",
    ring:  "ring-red-500/30",
  },
  pending: {
    label: "Pending",
    dot:   "bg-amber-400",
    badge: "bg-amber-500/12 text-amber-400 border border-amber-500/20",
    ring:  "ring-amber-500/30",
  },
};
function getStatus(s) { return STATUS_CFG[s] || STATUS_CFG.pending; }

/* ─── Avatar ───────────────────────────────────────────── */
function Avatar({ name, size = 36 }) {
  const bg  = avatarColor(name);
  const ini = initials(name);
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-semibold text-white"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
    >
      {ini}
    </div>
  );
}

/* ─── Skeleton row (loading state) ─────────────────────── */
function SkeletonRow() {
  return (
    <div
      className="grid items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] animate-pulse"
      style={{ gridTemplateColumns: "72px 1fr 140px 100px 110px 90px 100px" }}
    >
      <div className="h-3 bg-white/5 rounded w-12" />
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-white/5 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 bg-white/5 rounded w-28" />
          <div className="h-2.5 bg-white/5 rounded w-20" />
        </div>
      </div>
      <div className="h-3 bg-white/5 rounded w-20" />
      <div className="h-3 bg-white/5 rounded w-16" />
      <div className="h-5 bg-white/5 rounded-lg w-20" />
      <div className="h-3 bg-white/5 rounded w-14" />
      <div className="h-5 bg-white/5 rounded-full w-20" />
    </div>
  );
}

/* ─── Stat Card ────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent, loading }) {
  return (
    <div className="relative bg-[#0d1b2e] border border-white/8 rounded-2xl px-5 py-4 overflow-hidden group hover:border-white/15 transition-all duration-300">
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: accent + "22" }}>
          {icon}
        </div>
        {sub !== undefined && (
          <span className="text-[10px] text-[#64748b] font-medium bg-white/5 px-2 py-0.5 rounded-full">{sub}</span>
        )}
      </div>
      {loading ? (
        <div className="h-7 w-24 bg-white/5 rounded animate-pulse mb-1" />
      ) : (
        <div className="text-2xl font-bold text-[#f0f4f8] tracking-tight">{value}</div>
      )}
      <div className="text-[11px] text-[#64748b] mt-0.5 font-medium">{label}</div>
    </div>
  );
}

/* ─── Booking Row ───────────────────────────────────────── */
function BookingRow({ b, onClick, isLast }) {
  const cfg = getStatus(b.status);
  return (
    <div
      onClick={onClick}
      className={`group grid items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-white/[0.03] transition-colors duration-150
        ${!isLast ? "border-b border-white/[0.06]" : ""}`}
      style={{ gridTemplateColumns: "72px 1fr 140px 100px 110px 90px 100px" }}
    >
      {/* ID */}
      <div className="font-mono text-[11px] text-[#475569] group-hover:text-[#64748b] transition-colors">
        #{b.id}
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar name={b.user} size={32} />
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#e2e8f0] truncate">{b.user}</div>
          <div className="text-[11px] text-[#475569] mt-0.5">{b.mobile}</div>
        </div>
      </div>

      {/* Turf */}
      <div className="flex items-center gap-1.5">
        <span className="text-base">🏟️</span>
        <span className="text-xs text-[#94a3b8] truncate">{b.turf}</span>
      </div>

      {/* Date */}
      <div className="text-xs text-[#64748b]">{fmtDate(b.date)}</div>

      {/* Slot */}
      <div className="font-mono text-[11px] text-[#64748b] bg-white/4 rounded-lg px-2 py-1 w-fit">
        {b.slot}
      </div>

      {/* Amount */}
      <div className="text-sm font-bold text-[#f0f4f8]">{fmtAmount(b.amount)}</div>

      {/* Status */}
      <div className="flex items-center">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

/* ─── Detail Modal ──────────────────────────────────────── */
function BookingModal({ b, onClose }) {
  const cfg = getStatus(b.status);

  return (
    <Modal title="" onClose={onClose} width={440}>
      {/* Header strip */}
      <div className={`-mx-5 -mt-5 mb-5 px-5 py-4 flex items-center gap-3.5 rounded-t-xl ring-1 ${cfg.ring} bg-gradient-to-r from-white/[0.03] to-transparent`}>
        <Avatar name={b.user} size={44} />
        <div>
          <div className="text-base font-bold text-[#f0f4f8]">{b.user}</div>
          <div className="text-xs text-[#64748b] mt-0.5">{b.mobile}</div>
        </div>
        <div className="ml-auto">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Amount hero */}
      <div className="flex items-center justify-between mb-5 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/8">
        <div>
          <div className="text-[10px] text-[#64748b] uppercase font-semibold tracking-wider mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-[#f0f4f8]">{fmtAmount(b.amount)}</div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold
          ${b.paid ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
          {b.paid ? "✅ Paid" : "⏳ Pending"}
        </div>
      </div>

      {/* Detail rows */}
      <div className="flex flex-col divide-y divide-white/[0.06]">
        {[
          { label: "Booking ID", value: `#${b.id}`,        mono: true },
          { label: "Turf",       value: b.turf                        },
          { label: "Date",       value: fmtDate(b.date)               },
          { label: "Slot",       value: b.slot,             mono: true },
          { label: "Booked on",  value: fmtDate(b.createdAt)          },
        ].map(({ label, value, mono }) => (
          <div key={label} className="flex justify-between items-center py-2.5">
            <span className="text-[11px] text-[#475569] font-semibold uppercase tracking-wider">{label}</span>
            <span className={`text-sm text-[#94a3b8] ${mono ? "font-mono text-xs bg-white/5 px-2 py-0.5 rounded" : ""}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        {b.status === "confirmed" && (
          <button className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition">
            Cancel Booking
          </button>
        )}
        <Btn onClick={onClose} className="flex-1">Close</Btn>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
const TABS = ["all", "confirmed", "cancelled"];
const SORT_OPTIONS = [
  { value: "date_desc",   label: "Date (Newest)" },
  { value: "date_asc",    label: "Date (Oldest)" },
  { value: "amount_desc", label: "Amount (High)"  },
  { value: "amount_asc",  label: "Amount (Low)"   },
];

function BookingsPage() {
  // ── consume real API context ────────────────────────
  const { bookings, loading, fetchOwnerBookings } = useBooking();

  const [tab, setTab]             = useState("all");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);
  const [sort, setSort]           = useState("date_desc");
  const [payFilter, setPayFilter] = useState("all");

  // Fetch bookings when page mounts
  useEffect(() => { fetchOwnerBookings(); }, [fetchOwnerBookings]);

  /* ── derived stats ─────────────────────────────────── */
  const totalRevenue = useMemo(
    () => bookings.filter((b) => b.status === "confirmed" && b.paid).reduce((s, b) => s + b.amount, 0),
    [bookings]
  );
  const confirmed  = useMemo(() => bookings.filter((b) => b.status === "confirmed").length,  [bookings]);
  const paidCount  = useMemo(() => bookings.filter((b) => b.paid).length,                    [bookings]);
  const pendingAmt = useMemo(
    () => bookings.filter((b) => !b.paid && b.status === "confirmed").reduce((s, b) => s + b.amount, 0),
    [bookings]
  );

  /* ── filter + sort ─────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = bookings
      .filter((b) => tab === "all" || b.status === tab)
      .filter((b) => payFilter === "all" ? true : payFilter === "paid" ? b.paid : !b.paid)
      .filter((b) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          String(b.id).includes(q)         ||
          b.user.toLowerCase().includes(q) ||
          b.turf.toLowerCase().includes(q) ||
          b.mobile.includes(search)
        );
      });

    return [...list].sort((a, b_) => {
      if (sort === "amount_desc") return b_.amount - a.amount;
      if (sort === "amount_asc")  return a.amount - b_.amount;
      const da = new Date(a.date), db = new Date(b_.date);
      return sort === "date_asc" ? da - db : db - da;
    });
  }, [bookings, tab, search, sort, payFilter]);

  /* ── tab counts ────────────────────────────────────── */
  const tabCounts = useMemo(() => ({
    all:       bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  /* ── subtotal for footer ───────────────────────────── */
  const subtotal = useMemo(
    () => filtered.filter((b) => b.status === "confirmed" && b.paid).reduce((s, b) => s + b.amount, 0),
    [filtered]
  );

  return (
    <div className="fade-in flex flex-col gap-5">

      {/* ── Page header ──────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0f4f8] tracking-tight">Bookings</h2>
          <p className="text-sm text-[#475569] mt-1">
            {loading ? "Loading…" : `${bookings.length} total · ${fmtAmount(totalRevenue)} collected`}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] text-xs">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, turf, ID…"
            className="pl-8 pr-4 py-2 text-sm rounded-xl w-56 bg-[#0d1b2e] border border-white/8 text-[#e2e8f0] placeholder-[#334155] focus:outline-none focus:border-white/20 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8] text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Stat cards ───────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard icon="💰" label="Revenue Collected"  value={fmtAmount(totalRevenue)} accent="#10b981" loading={loading} />
        <StatCard icon="✅" label="Confirmed Bookings" value={confirmed}               accent="#6366f1" loading={loading} sub={`${bookings.length} total`} />
        <StatCard icon="💳" label="Paid Bookings"      value={paidCount}               accent="#a855f7" loading={loading} sub={`${bookings.length - paidCount} unpaid`} />
        <StatCard icon="⏳" label="Pending Amount"     value={fmtAmount(pendingAmt)}   accent="#f59e0b" loading={loading} />
      </div>

      {/* ── Filters bar ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#0d1b2e] border border-white/8 rounded-xl p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 flex items-center gap-1.5
                ${tab === t ? "bg-white/10 text-[#f0f4f8] shadow-sm" : "text-[#475569] hover:text-[#94a3b8]"}`}
            >
              {t}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                ${tab === t ? "bg-white/10 text-[#94a3b8]" : "bg-white/4 text-[#334155]"}`}>
                {tabCounts[t]}
              </span>
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Payment filter */}
          <div className="flex items-center gap-1 bg-[#0d1b2e] border border-white/8 rounded-xl p-1">
            {[
              { v: "all",    l: "All"    },
              { v: "paid",   l: "Paid"   },
              { v: "unpaid", l: "Unpaid" },
            ].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setPayFilter(v)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all
                  ${payFilter === v ? "bg-white/10 text-[#f0f4f8]" : "text-[#475569] hover:text-[#64748b]"}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs bg-[#0d1b2e] border border-white/8 rounded-xl px-3 py-2 text-[#94a3b8] outline-none cursor-pointer hover:border-white/15 transition"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div className="bg-[#0d1b2e] border border-white/8 rounded-2xl overflow-hidden">

        {/* Table header */}
        <div
          className="grid items-center gap-3 px-5 py-3 border-b border-white/8 bg-white/[0.025]"
          style={{ gridTemplateColumns: "72px 1fr 140px 100px 110px 90px 100px" }}
        >
          {["ID", "Customer", "Turf", "Date", "Slot", "Amount", "Status"].map((h) => (
            <div key={h} className="text-[10px] font-bold text-[#334155] uppercase tracking-widest">{h}</div>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {/* Rows */}
        {!loading && filtered.length > 0 &&
          filtered.map((b, i) => (
            <BookingRow
              key={b.id}
              b={b}
              onClick={() => setSelected(b)}
              isLast={i === filtered.length - 1}
            />
          ))
        }

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3 opacity-30">📋</div>
            <div className="text-sm text-[#334155] font-medium">
              {bookings.length === 0 ? "No bookings yet" : "No bookings match your filters"}
            </div>
            {bookings.length > 0 && (
              <button
                onClick={() => { setSearch(""); setTab("all"); setPayFilter("all"); }}
                className="mt-3 text-xs text-[#475569] hover:text-[#64748b] underline underline-offset-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.015] flex items-center justify-between">
            <span className="text-[11px] text-[#334155]">
              Showing {filtered.length} of {bookings.length} bookings
            </span>
            <span className="text-[11px] text-[#334155]">
              Subtotal:{" "}
              <span className="text-[#64748b] font-semibold">{fmtAmount(subtotal)}</span>
            </span>
          </div>
        )}
      </div>

      {/* ── Detail Modal ──────────────────────────────── */}
      {selected && <BookingModal b={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default BookingsPage;
