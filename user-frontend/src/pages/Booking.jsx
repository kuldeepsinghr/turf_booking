import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

function generateBookingId(date, turfId) {
  const hash = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRF-${date?.replace(/-/g, "")}-${hash}`;
}

export default function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { fetchMyBookings, bookings } = useBooking();
  const qrRef = useRef(null);

  useEffect(() => {
    if (!state) fetchMyBookings();
  }, []);

  useEffect(() => {
    if (!state || !qrRef.current) return;
    const bookingId = state?.bookingIds?.[0];
    const qrData = JSON.stringify({
      id: bookingId,
      venue: state.turf?.name,
      location: state.turf?.location,
      date: state.date,
      slots: state.selectedSlots?.map((s) => `${s.time}-${s.endTime}`),
      total: state.totalPrice,
    });
    QRCode.toCanvas(qrRef.current, qrData, {
      width: 90,
      color: { dark: "#000000", light: "#ffffff" },
    });
  }, [state]);

  if (!state && bookings.length === 0)
    return <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center text-white">Loading...</div>;

  const { turf, selectedSlots, totalPrice, date } = state;
  const bookingId = state?.bookingIds?.[0];

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0c0e16] text-white p-6 flex flex-col items-center font-sans">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Confirmed
        </div>
        <h1 className="text-3xl font-black tracking-tight">Booking Confirmed</h1>
        <p className="text-gray-500 text-sm mt-1">Your slot is reserved. See you on the pitch!</p>
      </div>

      {/* Pass Card */}
      <div className="w-full max-w-sm bg-[#13151f] border border-[#1f2235] rounded-2xl overflow-hidden shadow-2xl">

        {/* Top section */}
        <div className="p-5 border-b border-dashed border-[#1f2235] relative">
          {/* Notch cutouts */}
          <div className="absolute bottom-[-12px] left-[-12px] w-6 h-6 bg-[#0c0e16] rounded-full z-10" />
          <div className="absolute bottom-[-12px] right-[-12px] w-6 h-6 bg-[#0c0e16] rounded-full z-10" />

          {/* Venue */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl flex-shrink-0">
              ⚽
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">{turf.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{turf.location}</p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/[0.03] border border-[#1f2235] rounded-xl p-2.5">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Date</p>
              <p className="text-sm font-bold text-gray-100">{formattedDate}</p>
            </div>
            <div className="bg-white/[0.03] border border-[#1f2235] rounded-xl p-2.5">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Slots</p>
              <p className="text-sm font-bold text-gray-100">{selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Slots */}
          <div className="flex flex-col gap-1.5">
            {selectedSlots.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-white/[0.02] border border-[#1f2235] rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-400">{s.time} – {s.endTime}</span>
                <span className="text-emerald-400 font-medium">₹{s.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — QR pass */}
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl flex-shrink-0">
              <canvas ref={qrRef} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Booking ID</p>
              <p className="font-black text-base tracking-wider text-gray-100 mb-2">{bookingId}</p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Scan at venue entry<br />
                Valid for {formattedDate} only
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1f2235]">
            <span className="text-sm text-gray-500">Total Paid</span>
            <span className="text-2xl font-black text-emerald-400">₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 w-full max-w-sm">
        <button className="flex-1 py-3 rounded-xl bg-[#13151f] border border-[#1f2235] text-gray-400 text-sm font-medium">
          Share Pass
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-3 rounded-xl bg-emerald-400 text-black text-sm font-bold"
        >
          Back Home
        </button>
      </div>
    </div>
  );
}