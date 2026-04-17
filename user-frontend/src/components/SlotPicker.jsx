import { useState } from "react";
import {
  ArrowLeft, Star, MapPin, Clock, Users, Zap, CheckCircle,
  Shield, Wifi, Car, Utensils, Lightbulb, X, ChevronRight,
  Calendar, Phone, Share2, Heart, Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { useBooking } from "../context/BookingContext";

const amenityIcons = {
  Floodlights: <Lightbulb className="w-3.5 h-3.5" />,
  Parking: <Car className="w-3.5 h-3.5" />,
  "Changing Room": <Users className="w-3.5 h-3.5" />,
  Canteen: <Utensils className="w-3.5 h-3.5" />,
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  Shower: <Shield className="w-3.5 h-3.5" />,
  "Pro Kit": <Zap className="w-3.5 h-3.5" />,
};

export default function SlotPicker({ turf, onBack, selectedDate, onDateChange }) {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const { createBooking } = useBooking();
  // const [date, setDate] = useState(getTodayStr());
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const date = selectedDate;
const setDate = onDateChange;
  const [wishlist, setWishlist] = useState(false);

  function getTodayStr() {
    return new Date().toISOString().split("T")[0];
  }

  const handleCall = () => {
  if (!turf?.owner?.mobile) {
    alert("Phone number not available");
    return;
  }

  window.location.href = `tel:${turf.owner.mobile}`;
};

const handleDirections = () => {
  if (turf.lat && turf.lng) {
    window.open(
      `https://www.google.com/maps?q=${turf.lat},${turf.lng}`,
      "_blank"
    );
  } else {
    const encoded = encodeURIComponent(turf.location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      "_blank"
    );
  }
};

  function getNext7Days() {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        iso: d.toISOString().split("T")[0],
        day: d.toLocaleDateString("en-IN", { weekday: "short" }),
        date: d.getDate(),
        month: d.toLocaleDateString("en-IN", { month: "short" }),
        isToday: i === 0,
        isTomorrow: i === 1,
      };
    });
  }

  function toggleSlot(slot) {
    if (slot.status === "booked") return;
    setSelectedSlots((prev) =>
      prev.find((s) => s.id === slot.id)
        ? prev.filter((s) => s.id !== slot.id)
        : [...prev, slot]
    );
  }

  const totalPrice = selectedSlots.reduce(
  (sum, s) => sum + Number(s.price),
  0
);

  // Group slots by time period
  function groupSlots(slots) {
    const morning = slots.filter(s => {
      const h = parseInt(s.time.split(":")[0]);
      return h < 12;
    });
    const afternoon = slots.filter(s => {
      const h = parseInt(s.time.split(":")[0]);
      return h >= 12 && h < 17;
    });
    const evening = slots.filter(s => {
      const h = parseInt(s.time.split(":")[0]);
      return h >= 17;
    });
    return { morning, afternoon, evening };
  }

  const grouped = groupSlots(turf.slots || []);

  const formatDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const bookingId = "TF" + Math.floor(10000 + Math.random() * 90000);

  /* ─── CONFIRMATION SCREEN ─── */
 

  /* ─── SLOT PICKER SCREEN ─── */
  const days = getNext7Days();

  function SlotGroup({ title, icon, slots }) {
    if (!slots || slots.length === 0) return null;
    const availCount = slots.filter(s => s.status !== "booked").length;
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <span className="text-sm font-semibold text-gray-200">{title}</span>
          </div>
          <span className="text-xs text-gray-500">{availCount} available</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => {
            const isSelected = !!selectedSlots.find((s) => s.id === slot.id);
            const isBooked = slot.status === "booked";
            return (
              <button
                key={slot.id}
                onClick={() => toggleSlot(slot)}
                disabled={isBooked}
                className={`relative flex flex-col items-center py-3 px-2 rounded-xl border transition-all duration-150 ${
                  isBooked
                    ? "bg-[#1a1d27] border-white/5 opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "bg-emerald-400/10 border-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.3)]"
                    : "bg-[#1a1d27] border-white/10 hover:border-white/25 hover:bg-[#1e2130] active:scale-95"
                }`}
              >
                {/* Time range */}
                <span className={`text-xs font-bold font-mono leading-none mb-1 ${
                  isBooked ? "text-gray-600" : isSelected ? "text-emerald-400" : "text-white"
                }`}>
                  {slot.time}
                </span>
                <span className="text-[10px] text-gray-600 mb-2">to {slot.endTime}</span>

                {/* Price or status */}
                {isBooked ? (
                  <span className="text-[10px] text-gray-600 bg-gray-800/60 px-2 py-0.5 rounded-md">Booked</span>
                ) : (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-emerald-400/20 text-emerald-400"
                      : "bg-[#252836] text-gray-300"
                  }`}>
                    ₹{slot.price}
                  </span>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                      <svg viewBox="0 0 10 8" className="w-2 h-2" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-emerald-400/0" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#0f1117]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-[#1a1d27] border border-white/10 flex items-center justify-center hover:border-white/20 active:scale-90 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-300" />
            </button>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">{turf.name}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />{turf.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWishlist(w => !w)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                wishlist ? "bg-rose-500/15 border-rose-500/40" : "bg-[#1a1d27] border-white/10 hover:border-white/20"
              }`}
            >
              <Heart className={`w-4 h-4 transition-colors ${wishlist ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-[#1a1d27] border border-white/10 flex items-center justify-center hover:border-white/20 transition-all">
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-44">

        {/* Hero Card */}
        <div className="mt-4 mb-4 rounded-2xl overflow-hidden border border-white/5 relative">
          <div className="relative h-48 overflow-hidden">
            <img src={turf.image} alt={turf.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/30 to-transparent" />

            {/* Tag */}
            {turf.tag && (
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${turf.tagColor}`}>
                  {turf.tag}
                </span>
              </div>
            )}

            {/* Rating pill */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-white text-xs font-bold">{turf.rating}</span>
              <span className="text-gray-400 text-[10px]">({turf.reviews})</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="bg-[#1a1d27] p-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Surface", value: turf.surface, icon: "🏟️" },
                { label: "Format", value: turf.size, icon: "👥" },
                { label: "Hours", value: `${turf.openTime}–${turf.closeTime}`, icon: "🕐" },
              ].map((item) => (
                <div key={item.label} className="bg-[#0f1117] rounded-xl p-3 text-center border border-white/5">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">{item.label}</div>
                  <div className="text-xs font-semibold text-white mt-0.5 font-mono">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Price per hour */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-sm text-gray-400">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-emerald-400 text-xl font-bold">₹{turf?.price}</span>
                <span className="text-gray-500 text-xs">/hr</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {turf.amenities?.map((a) => (
                <div key={a} className="flex items-center gap-1.5 bg-[#0f1117] border border-white/5 px-2.5 py-1.5 rounded-lg">
                  <span className="text-emerald-400">{amenityIcons[a] || <Zap className="w-3.5 h-3.5" />}</span>
                  <span className="text-xs text-gray-300">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact / Info strip */}
        <div className="flex gap-2 mb-5">
          <button  onClick={handleCall} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-gray-300 text-xs hover:border-white/20 transition-all">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            Call Venue
          </button>
          <button onClick={handleDirections} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-gray-300 text-xs hover:border-white/20 transition-all">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Get Directions
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1d27] border border-white/10 rounded-xl text-gray-300 text-xs hover:border-white/20 transition-all">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            About
          </button>
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-base">Book a Slot</h3>
          <div className="flex gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#1a1d27] border border-white/20 inline-block" />Free</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400/20 border border-emerald-400 inline-block" />Selected</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-800/60 opacity-40 inline-block" />Booked</span>
          </div>
        </div>

        {/* Date Strip */}
        <div className="mb-5 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {days.map((d) => (
              <button
                key={d.iso}
                onClick={() => { setDate(d.iso); setSelectedSlots([]); }}
                className={`flex-shrink-0 flex flex-col items-center w-[60px] py-3 rounded-2xl border transition-all duration-200 ${
                  date === d.iso
                    ? "bg-emerald-400 border-emerald-400"
                    : "bg-[#1a1d27] border-white/10 hover:border-white/20"
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${date === d.iso ? "text-black/60" : "text-gray-500"}`}>
                  {d.day}
                </span>
                <span className={`font-bold text-xl leading-tight ${date === d.iso ? "text-black" : "text-white"}`}>
                  {d.date}
                </span>
                <span className={`text-[10px] ${date === d.iso ? "text-black/50" : "text-gray-600"}`}>
                  {d.isToday ? "Today" : d.isTomorrow ? "Tmrw" : d.month}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected date display */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-sm text-gray-300">{formatDate(date)}</span>
        </div>

        {/* Slot groups */}
        {(!turf.slots || turf.slots.length === 0) ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-3">⚽</div>
            <p className="text-sm">No slots available for this date</p>
          </div>
        ) : (
          <>
            <SlotGroup title="Morning" icon="🌅" slots={grouped.morning} />
            <SlotGroup title="Afternoon" icon="☀️" slots={grouped.afternoon} />
            <SlotGroup title="Evening" icon="🌆" slots={grouped.evening} />
          </>
        )}
      </div>

      {/* ─── Bottom Booking Bar ─── */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          {/* Blur backdrop */}
          <div className="bg-[#0f1117]/80 backdrop-blur-xl border-t border-emerald-400/10">
            <div className="max-w-2xl mx-auto px-4 pt-3 pb-6">
              {/* Slot chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {selectedSlots.map((s) => (
                  <div key={s.id} className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/25 px-3 py-1.5 rounded-lg">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-mono text-emerald-400 font-semibold">{s.time}–{s.endTime}</span>
                    <button
                      onClick={() => toggleSlot(s)}
                      className="ml-0.5 w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center hover:bg-emerald-400/40 transition-colors"
                    >
                      <X className="w-2.5 h-2.5 text-emerald-400" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""} · {selectedSlots.length} hr
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">₹{totalPrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">total</span>
                  </div>
                </div>
                <button
                 onClick={async () => {
  if (!isAuthenticated) {
    navigate("/login", {
      state: {
        redirectTo: "/booking-success",
        bookingData: {
          turf,
          selectedSlots,
          totalPrice,
          date,
        },
      },
    });
    return;
  }

  // 🔥 Call API for each slot
  for (let slot of selectedSlots) {
    const res = await createBooking({
      turf_id: turf.id,
      slot_id: slot.id,
    });

    if (!res.success) {
      alert(res.message);
      return;
    }
  }

  // ✅ After success
  navigate("/booking-success", {
    state: {
      turf,
      selectedSlots,
      totalPrice,
      date,
    },
  });
}}
                  className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-bold px-7 py-3.5 rounded-xl transition-all duration-150 text-sm"
                >
                  Confirm Booking
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}