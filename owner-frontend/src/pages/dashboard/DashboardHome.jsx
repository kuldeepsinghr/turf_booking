import StatCard from "../../components/dashboard/StatCard";
import { staticBookings, staticTurfs, staticSlots } from "../../data/staticData";
import {Btn} from "../../components/dashboard/UI";
import { useEffect } from "react";


import { useBooking } from "../../context/BookingContext";
import { useTurf } from "../../context/TurfContext";
import { useSlot } from "../../context/SlotContext";
import { useAuth } from "../../context/AuthContext";


function DashboardHome({ setPage }) {
   const { bookings, fetchOwnerBookings } = useBooking();
  const { turfs } = useTurf();
  const { slots } = useSlot();
  const { profile, fetchOwnerProfile } = useAuth();

  const confirmed = bookings.filter(b => b.status === "confirmed").length;
const cancelled = bookings.filter(b => b.status === "cancelled").length;
const total = bookings.length || 1;



// ✅ Fetch bookings when dashboard loads
useEffect(() => {
  fetchOwnerBookings();
  // fetchOwnerProfile();
  }, []);


   // ✅ Revenue (only confirmed)
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div className="fade-in">
      
      {/* Welcome */}
      <div className="mb-7">
        <h1 className="text-[22px] font-bold text-[#f0f4f8] mb-1">
          Good morning, {profile?.name || "Owner"} 👋
        </h1>
        <p className="text-sm text-[#64748b]">
          Here's what's happening with your turfs today.
        </p>
      </div>

    {/* ✅ Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-7">
        <StatCard icon="⚽" label="Total turfs" value={turfs.length} />
        <StatCard icon="📋" label="Total bookings" value={bookings.length} />
        <StatCard
          icon="🕐"
          label="Available slots"
          value={slots.filter((s) => !s.is_booked).length}
        />
        <StatCard
          icon="₹"
          label="Revenue"
          value={`₹${totalRevenue}`}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

    {/* Recent bookings */}
<div className="bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden">
  
  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
    <span className="font-semibold text-sm text-[#f0f4f8]">
      Recent bookings
    </span>
    <Btn onClick={() => setPage("bookings")}>
      View all
    </Btn>
  </div>

  <div>
    {bookings.slice(0, 5).map((b, i) => (
      <div
        key={b.id}
        className={`flex items-center gap-3.5 px-5 py-3 ${
          i < 4 ? "border-b border-white/10" : ""
        }`}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-xs text-green-500">
          {b.user?.[0]}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="text-sm text-white">{b.user}</div>
          <div className="text-xs text-gray-400">
            {b.turf} · {b.slot}
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="text-sm text-white">₹{b.amount}</div>
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
          {turfs.map((t, i) => (
  <div key={t.id} className="flex items-center gap-3 px-4 py-3">
    <div className="w-8 h-8 bg-green-500/10 flex items-center justify-center">
      ⚽
    </div>

    <div className="flex-1">
      <div className="text-sm text-white">{t.name}</div>
      <div className="text-xs text-gray-400">
        ₹{t.price}/hr
      </div>
    </div>

    <span className={`badge ${t.status === "active" ? "active-t" : "inactive"}`}>
      {t.status}
    </span>
  </div>
))}

          {/* Booking Status */}
          <div className="bg-[#0f1e32] border border-white/10 rounded-2xl p-4">
            <div className="text-sm font-semibold text-[#f0f4f8] mb-3.5">
              Booking status
            </div>

            {[
              {
                label: "Confirmed",
                count: confirmed,
                color: "#22c55e",
              },
              {
                label: "Cancelled",
                count: cancelled,
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
                      width: `${(count / total) * 100}%`,
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