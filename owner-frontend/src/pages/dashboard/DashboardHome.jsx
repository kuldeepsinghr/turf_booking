import StatCard from "../../components/dashboard/StatCard";
import { staticBookings, staticTurfs, staticSlots } from "../../data/staticData";
import {Btn} from "../../components/dashboard/UI";


function DashboardHome({ setPage }) {
  const totalRevenue = staticBookings
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div className="fade-in">
      
      {/* Welcome */}
      <div className="mb-7">
        <h1 className="text-[22px] font-bold text-[#f0f4f8] mb-1">
          Good morning, Vikram 👋
        </h1>
        <p className="text-sm text-[#64748b]">
          Here's what's happening with your turfs today.
        </p>
      </div>

      {/* Stats */}
      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-7">
        <StatCard icon="⚽" label="Total turfs" value={staticTurfs.length} sub="↑ 1 this month" color="#22c55e" delay={0} />
        <StatCard icon="📋" label="Total bookings" value={staticBookings.length} sub="↑ 3 this week" color="#3b82f6" delay={60} />
        <StatCard icon="🕐" label="Available slots" value={staticSlots.filter((s) => !s.booked).length} sub="across all turfs" color="#f59e0b" delay={120} />
        <StatCard icon="₹" label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="confirmed only" color="#a855f7" delay={180} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

        {/* Recent bookings */}
        <div className="bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="font-semibold text-sm text-[#f0f4f8]">
              Recent bookings
            </span>
            <Btn
              variant="ghost"
              onClick={() => setPage("bookings")}
              className="px-3 py-1.5 text-xs"
            >
              View all
            </Btn>
          </div>

          {/* List */}
          <div>
            {staticBookings.slice(0, 5).map((b, i) => (
              <div
                key={b.id}
                className={`flex items-center gap-3.5 px-5 py-3 ${
                  i < 4 ? "border-b border-white/10" : ""
                } hover:bg-white/5`}
              >
                {/* Avatar */}
                <div className="w-8.5 h-8.5 rounded-lg bg-green-500/10 flex items-center justify-center text-xs font-bold text-green-500 shrink-0">
                  {b.user
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#f0f4f8] truncate">
                    {b.user}
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    {b.turf} · {b.slot}
                  </div>
                </div>

                {/* Price + Status */}
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#f0f4f8]">
                    ₹{b.amount}
                  </div>
                  <span className={`badge ${b.status}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">

          {/* My turfs */}
          <div className="bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="font-semibold text-sm text-[#f0f4f8]">
                My turfs
              </span>
              <Btn
                variant="ghost"
                onClick={() => setPage("turfs")}
                className="px-2.5 py-1 text-[11px]"
              >
                Manage
              </Btn>
            </div>

            {staticTurfs.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i < staticTurfs.length - 1
                    ? "border-b border-white/10"
                    : ""
                } hover:bg-white/5`}
              >
                <div className="w-8.5 h-8.5 rounded-lg bg-green-500/10 flex items-center justify-center text-base">
                  {t.img}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#f0f4f8] truncate">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    ₹{t.price}/hr
                  </div>
                </div>

                <span
                  className={`badge ${
                    t.status === "active" ? "active-t" : "inactive"
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>

          {/* Booking Status */}
          <div className="bg-[#0f1e32] border border-white/10 rounded-2xl p-4">
            <div className="text-sm font-semibold text-[#f0f4f8] mb-3.5">
              Booking status
            </div>

            {[
              {
                label: "Confirmed",
                count: staticBookings.filter((b) => b.status === "confirmed")
                  .length,
                color: "#22c55e",
              },
              {
                label: "Cancelled",
                count: staticBookings.filter((b) => b.status === "cancelled")
                  .length,
                color: "#ef4444",
              },
            ].map(({ label, count, color }) => (
              <div key={label} className="mb-3">
                
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-[#64748b]">{label}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color }}
                  >
                    {count}
                  </span>
                </div>

                <div className="h-[5px] rounded bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      background: color,
                      width: `${(count / staticBookings.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;