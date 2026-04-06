import React from "react";
import { MapPin, Star, Clock, Users, Zap } from "lucide-react";

const amenityIcons = {
  Floodlights: "💡",
  Parking: "🅿️",
  "Changing Room": "🚿",
  Cafeteria: "☕",
  "AC Lounge": "❄️",
  Showers: "🚿",
  "Drinking Water": "💧",
};

export default function TurfCard({ turf, onClick, index }) {
  return (
    <div
      className="card-hover bg-[#161e16] border border-[#1f2d1f] rounded-2xl overflow-hidden cursor-pointer group animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
      onClick={() => onClick(turf)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161e16] via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {turf.badge && (
            <span className="px-2.5 py-1 bg-[#a3e635] text-[#0a0f0a] text-xs font-display font-bold rounded-lg badge-glow">
              {turf.badge}
            </span>
          )}
          {!turf.available && (
            <span className="px-2.5 py-1 bg-[#0a0f0a]/80 text-red-400 text-xs font-medium rounded-lg border border-red-900/50">
              Fully Booked
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3 bg-[#0a0f0a]/80 backdrop-blur-sm border border-[#1f2d1f] px-3 py-1.5 rounded-xl">
          <span className="text-[#a3e635] font-display font-bold text-sm">₹{turf.price}</span>
          <span className="text-[#4b6b4b] text-xs">/hr</span>
        </div>

        {/* Distance badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#0a0f0a]/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <MapPin size={11} className="text-[#a3e635]" />
          <span className="text-xs text-[#e8f5e8] font-medium">{turf.distance}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display font-bold text-base text-[#e8f5e8] leading-tight">{turf.name}</h3>
            <p className="text-[#8ba98b] text-xs mt-0.5 flex items-center gap-1">
              <MapPin size={10} /> {turf.location}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Star size={12} className="text-[#a3e635] fill-[#a3e635]" />
            <span className="text-sm font-bold text-[#e8f5e8]">{turf.rating}</span>
            <span className="text-[#4b6b4b] text-xs">({turf.reviews})</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {turf.sport.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-[#0a2010] border border-[#16a34a]/30 rounded text-xs text-[#22c55e] font-medium">
              {s}
            </span>
          ))}
          <span className="px-2 py-0.5 bg-[#111711] border border-[#1f2d1f] rounded text-xs text-[#8ba98b]">
            {turf.size}
          </span>
          <span className="px-2 py-0.5 bg-[#111711] border border-[#1f2d1f] rounded text-xs text-[#8ba98b]">
            {turf.surface}
          </span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 mb-4 overflow-hidden">
          {turf.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs text-[#4b6b4b] flex items-center gap-0.5 flex-shrink-0">
              <span>{amenityIcons[a] || "•"}</span>
              <span className="hidden sm:inline">{a}</span>
            </span>
          ))}
          {turf.amenities.length > 3 && (
            <span className="text-xs text-[#4b6b4b]">+{turf.amenities.length - 3} more</span>
          )}
        </div>

        {/* CTA */}
        <button
          className={`w-full py-2.5 rounded-xl text-sm font-display font-bold transition-all ${
            turf.available
              ? "bg-[#16a34a] hover:bg-[#22c55e] text-white hover:shadow-lg hover:shadow-[#16a34a]/30"
              : "bg-[#161e16] border border-[#1f2d1f] text-[#4b6b4b] cursor-not-allowed"
          }`}
          disabled={!turf.available}
        >
          {turf.available ? "View Slots & Book" : "No Slots Available"}
        </button>
      </div>
    </div>
  );
}
