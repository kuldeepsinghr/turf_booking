import { useState } from "react";
import { staticBookings } from "../../data/staticData";
import Modal from "../../components/dashboard/Modal";
import { Btn } from "../../components/dashboard/UI";

function BookingsPage() {
  const [bookings] = useState(staticBookings);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = bookings
    .filter((b) => tab === "all" || b.status === tab)
    .filter(
      (b) =>
        !search ||
        b.user.toLowerCase().includes(search.toLowerCase()) ||
        b.turf.toLowerCase().includes(search.toLowerCase()) ||
        b.id.includes(search)
    );

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" && b.paid)
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div className="fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#f0f4f8]">Bookings</h2>
          <p className="text-sm text-[#64748b] mt-0.5">
            ₹{totalRevenue.toLocaleString()} collected ·{" "}
            {bookings.filter((b) => b.status === "confirmed").length} confirmed
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-sm">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings…"
            className="pl-9 pr-3 py-2 text-sm rounded-lg w-[220px] bg-white/5 border border-white/10 text-[#f0f4f8] focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Confirmed",
            value: bookings.filter((b) => b.status === "confirmed").length,
            color: "#22c55e",
            icon: "✅",
          },
          {
            label: "Cancelled",
            value: bookings.filter((b) => b.status === "cancelled").length,
            color: "#ef4444",
            icon: "❌",
          },
          {
            label: "Paid",
            value: bookings.filter((b) => b.paid).length,
            color: "#a855f7",
            icon: "💰",
          },
        ].map(({ label, value, color, icon }) => (
          <div
            key={label}
            className="bg-[#0f1e32] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div className="text-xl">{icon}</div>
            <div>
              <div
                className="text-lg font-bold"
                style={{ color }}
              >
                {value}
              </div>
              <div className="text-[11px] text-[#64748b]">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-4">
        {["all", "confirmed", "cancelled"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize border-b-2 transition ${
              tab === t
                ? "text-green-500 border-green-500"
                : "text-[#64748b] border-transparent hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="grid grid-cols-[80px_1.4fr_1fr_1fr_1fr_90px_90px] px-5 py-3 bg-white/5 border-b border-white/10 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">
          {["ID", "Customer", "Turf", "Date", "Slot", "Amount", "Status"].map(
            (h) => (
              <div key={h}>{h}</div>
            )
          )}
        </div>

        {/* Rows */}
        {filtered.map((b, i) => (
          <div
            key={b.id}
            onClick={() => setSelected(b)}
            className={`grid grid-cols-[80px_1.4fr_1fr_1fr_1fr_90px_90px] px-5 py-3 items-center cursor-pointer hover:bg-white/5 ${
              i < filtered.length - 1 ? "border-b border-white/10" : ""
            }`}
          >
            <div className="text-xs text-[#64748b] font-mono">{b.id}</div>

            <div>
              <div className="text-sm font-medium text-[#f0f4f8]">
                {b.user}
              </div>
              <div className="text-[11px] text-[#64748b]">
                {b.mobile}
              </div>
            </div>

            <div className="text-sm text-[#94a3b8]">{b.turf}</div>
            <div className="text-xs text-[#94a3b8]">{b.date}</div>
            <div className="text-xs font-mono text-[#94a3b8]">
              {b.slot}
            </div>

            <div className="text-sm font-semibold text-[#f0f4f8]">
              ₹{b.amount}
            </div>

            <span className={`badge ${b.status}`}>
              {b.status}
            </span>
          </div>
        ))}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#64748b]">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-sm text-[#94a3b8]">
              No bookings found
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <Modal
          title={`Booking ${selected.id}`}
          onClose={() => setSelected(null)}
          width={420}
        >
          <div className="flex flex-col gap-3.5">
            {[
              ["Customer", selected.user],
              ["Mobile", selected.mobile],
              ["Turf", selected.turf],
              ["Date", selected.date],
              ["Slot", selected.slot],
              ["Amount", `₹${selected.amount}`],
              ["Payment", selected.paid ? "✅ Paid" : "⏳ Pending"],
              ["Status", selected.status],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-center py-2 border-b border-white/10"
              >
                <span className="text-xs text-[#64748b] uppercase font-semibold">
                  {label}
                </span>
                <span className="text-sm text-[#f0f4f8]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Btn
              onClick={() => setSelected(null)}
              className="w-full"
            >
              Close
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BookingsPage;