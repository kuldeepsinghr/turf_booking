import React from "react";
import { MapPin, Star } from "lucide-react";

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
      className="bg-turf-card border border-turf-border rounded-2xl overflow-hidden cursor-pointer group animate-fade-up backdrop-blur-md hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => onClick(turf)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          {turf.badge && (
            <span className="px-2.5 py-1 bg-green-400 text-black text-xs font-bold rounded-lg shadow-md shadow-green-400/20">
              {turf.badge}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3 bg-[#020617]/80 backdrop-blur-sm border border-[#1e293b] px-3 py-1.5 rounded-xl">
          <span className="text-green-400 font-bold text-sm">₹{turf.price}</span>
          <span className="text-gray-500 text-xs">/hr</span>
        </div>

        {/* Distance */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#020617]/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <MapPin size={11} className="text-green-400" />
          <span className="text-xs text-white">{turf.distance}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="font-bold text-white">{turf.name}</h3>
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <MapPin size={10} /> {turf.location}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Star size={12} className="text-green-400 fill-green-400" />
            <span className="text-white text-sm font-bold">{turf.rating}</span>
            <span className="text-gray-500 text-xs">({turf.reviews})</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {turf.sport.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-[#020617] border border-green-400/30 rounded text-xs text-green-400">
              {s}
            </span>
          ))}
          <span className="px-2 py-0.5 bg-turf-muted border border-turf-border rounded text-xs text-gray-400">
            {turf.size}
          </span>
        </div>

        {/* CTA */}
        <button
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
            turf.available
              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:shadow-lg hover:shadow-green-400/30"
              : "bg-turf-muted border border-turf-border text-gray-500 cursor-not-allowed"
          }`}
          disabled={!turf.available}
        >
          {turf.available ? "View Slots & Book" : "No Slots Available"}
        </button>
      </div>
    </div>
  );
}