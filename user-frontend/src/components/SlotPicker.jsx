import { useState } from "react";
import {
  ArrowLeft, Star, MapPin, Clock, Users, Zap, CheckCircle,
  Shield, Wifi, Car, Utensils, Lightbulb, X
} from "lucide-react";

const amenityIcons = {
  Floodlights: <Lightbulb className="w-3.5 h-3.5" />,
  Parking: <Car className="w-3.5 h-3.5" />,
  "Changing Room": <Users className="w-3.5 h-3.5" />,
  Canteen: <Utensils className="w-3.5 h-3.5" />,
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  Shower: <Shield className="w-3.5 h-3.5" />,
  "Pro Kit": <Zap className="w-3.5 h-3.5" />,
};

export default function SlotPicker({ turf, onBack }) {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [date, setDate] = useState(getTodayStr());

  function getTodayStr() {
    return new Date().toISOString().split("T")[0];
  }

  function getNext7Days() {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        iso: d.toISOString().split("T")[0],
        day: d.toLocaleDateString("en-IN", { weekday: "short" }),
        date: d.getDate(),
        isToday: i === 0,
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

  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

 if (confirmed) {
  const bookingId = "TB" + Math.floor(Math.random() * 100000);

  return (
    <div className="min-h-screen bg-turf-dark flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-fade-up">

        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-turf-accent/20 border border-turf-accent flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-turf-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white">Booking Confirmed 🎉</h2>
          <p className="text-sm text-gray-400 mt-1">
            Your slot has been successfully reserved
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-turf-card border border-turf-border rounded-2xl overflow-hidden mb-5">

          {/* Image */}
          <div className="h-36 overflow-hidden">
            <img
              src={turf.image}
              alt={turf.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4">

            {/* Turf Info */}
            <div className="mb-3">
              <h3 className="text-white font-bold text-lg">{turf.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {turf.location}
              </p>
            </div>

            {/* Date */}
            <div className="mb-3 text-sm text-gray-300">
              📅 {new Date(date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>

            {/* Slots */}
            <div className="space-y-1 mb-3">
              {selectedSlots.map((s) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {s.time} - {s.endTime}
                  </span>
                  <span className="text-turf-accent font-bold">
                    ₹{s.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between border-t border-turf-border pt-3 text-sm font-bold">
              <span className="text-white">Total Paid</span>
              <span className="text-turf-accent text-lg">₹{totalPrice}</span>
            </div>

            {/* Booking ID */}
            <div className="mt-3 text-xs text-gray-500 text-center">
              Booking ID: <span className="text-turf-accent font-mono">{bookingId}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setConfirmed(false);
              setSelectedSlots([]);
              onBack();
            }}
            className="flex-1 py-3 rounded-xl border border-turf-border text-gray-300 text-sm hover:border-turf-accent/50"
          >
            Back Home
          </button>

          <button
            onClick={() => {
              setConfirmed(false);
              setSelectedSlots([]);
            }}
            className="flex-1 py-3 rounded-xl bg-turf-accent text-black font-bold text-sm hover:brightness-110"
          >
            Book Again
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-turf-dark animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-turf-dark/95 backdrop-blur border-b border-turf-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-turf-card border border-turf-border flex items-center justify-center hover:border-turf-accent/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-300" />
        </button>
        <div>
          <h2 className="font-display font-bold text-white text-lg leading-tight">{turf.name}</h2>
          <p className="text-xs text-gray-400 font-body">{turf.location}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-40">
        {/* Turf Hero Info */}
        <div className="mt-4 bg-turf-card border border-turf-border rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-display font-bold text-white">{turf.rating}</span>
              <span className="text-xs text-gray-500">• {turf.reviews} reviews</span>
            </div>
            {turf.tag && (
              <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md ${turf.tagColor}`}>
                {turf.tag}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Surface", val: turf.surface, icon: <Shield className="w-3.5 h-3.5 text-turf-accent" /> },
              { label: "Format", val: turf.size, icon: <Users className="w-3.5 h-3.5 text-turf-accent" /> },
              { label: "Hours", val: `${turf.openTime}–${turf.closeTime}`, icon: <Clock className="w-3.5 h-3.5 text-turf-accent" /> },
            ].map((item) => (
              <div key={item.label} className="bg-turf-muted rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">{item.icon}</div>
                <div className="text-xs text-gray-400 font-body">{item.label}</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">{item.val}</div>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {turf.amenities.map((a) => (
              <div key={a} className="flex items-center gap-1.5 bg-turf-muted px-2.5 py-1.5 rounded-lg">
                <span className="text-turf-accent">{amenityIcons[a] || <Zap className="w-3.5 h-3.5" />}</span>
                <span className="text-xs text-gray-300 font-body">{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-4">
          <h3 className="font-display font-bold text-white text-sm mb-3 uppercase tracking-widest opacity-60">
            Select Date
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {getNext7Days().map((d) => (
              <button
                key={d.iso}
                onClick={() => { setDate(d.iso); setSelectedSlots([]); }}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all duration-200 ${
                  date === d.iso
                    ? "border-turf-accent bg-turf-accent/10 text-turf-accent"
                    : "border-turf-border bg-turf-card text-gray-400 hover:border-turf-accent/40"
                }`}
              >
                <span className="text-[10px] font-mono uppercase">{d.day}</span>
                <span className={`font-display font-bold text-xl ${date === d.iso ? "text-turf-accent" : "text-white"}`}>
                  {d.date}
                </span>
                {d.isToday && (
                  <span className="text-[9px] font-mono text-turf-accent">TODAY</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4">
          {[
            { color: "bg-turf-muted border-turf-border", label: "Available" },
            { color: "bg-turf-accent/20 border-turf-accent", label: "Selected" },
            { color: "bg-gray-800 border-gray-700 opacity-50", label: "Booked" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded border ${l.color}`} />
              <span className="text-[10px] font-mono text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Slots Grid */}
        <h3 className="font-display font-bold text-white text-sm mb-3 uppercase tracking-widest opacity-60">
          Available Slots
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {turf.slots.map((slot) => {
            const isSelected = selectedSlots.find((s) => s.id === slot.id);
            const isBooked = slot.status === "booked";
            return (
              <button
                key={slot.id}
                onClick={() => toggleSlot(slot)}
                disabled={isBooked}
                className={`relative px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                  isBooked
                    ? "bg-gray-900/50 border-gray-800 opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "bg-turf-accent/15 border-turf-accent shadow-[0_0_16px_rgba(57,224,122,0.15)]"
                    : "bg-turf-card border-turf-border hover:border-turf-accent/50 hover:bg-turf-muted"
                }`}
              >
                <div className={`font-mono font-bold text-sm ${isBooked ? "text-gray-600" : isSelected ? "text-turf-accent" : "text-white"}`}>
                  {slot.time}
                </div>
                <div className="text-[10px] font-body text-gray-500 mt-0.5">
                  to {slot.endTime}
                </div>
                <div className={`text-xs font-mono font-bold mt-1.5 ${isBooked ? "text-gray-700" : "text-turf-accent"}`}>
                  {isBooked ? "Booked" : `₹${slot.price}`}
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-3.5 h-3.5 text-turf-accent" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Summary Bar */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-turf-dark/95 backdrop-blur border-t border-turf-accent/30 animate-slide-up">
          <div className="max-w-2xl mx-auto">
            {/* Selected slot chips */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {selectedSlots.map((s) => (
                <div key={s.id} className="flex-shrink-0 flex items-center gap-1.5 bg-turf-accent/10 border border-turf-accent/40 px-3 py-1.5 rounded-lg">
                  <span className="text-xs font-mono text-turf-accent font-bold">{s.time}</span>
                  <button onClick={() => toggleSlot(s)}>
                    <X className="w-3 h-3 text-turf-accent/60 hover:text-turf-accent" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-body">
                  {selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""} • {selectedSlots.length}hr
                </div>
                <div className="font-display font-bold text-xl text-white">
                  ₹{totalPrice}
                  <span className="text-xs text-gray-500 font-body font-normal ml-1">total</span>
                </div>
              </div>
              <button
                onClick={() => setConfirmed(true)}
                className="flex-shrink-0 bg-turf-accent text-turf-dark font-display font-bold px-8 py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all duration-150 text-sm"
              >
                Confirm Booking →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
