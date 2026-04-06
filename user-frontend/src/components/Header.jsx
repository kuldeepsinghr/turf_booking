import React from "react";
import { MapPin, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Header({ onSearch, searchQuery }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-turf-border bg-turf-dark/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <span className="text-black font-display font-bold text-sm">T</span>
          </div>
         <span className="font-display font-bold text-lg text-white tracking-tight">
  Turf<span className="text-green-400">Book</span>
</span>
        </div>

        {/* Location */}
        <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 ml-2">
          <div className="dot-live flex-shrink-0" />
          <MapPin size={13} className="text-green-400" />
          <span className="font-medium text-white">Mumbai, MH</span>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search turf, area..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0b1220] border border-[#1e293b] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
          />
        </div>

        {/* Notif */}
        <button className="relative p-2.5 rounded-xl bg-[#0b1220] border border-[#1e293b] hover:border-green-400 transition-all">
          <Bell size={16} className="text-[#8ba98b]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#a3e635] rounded-full" />
        </button>

        {/* Avatar */}
        <div onClick={() => navigate("/profile")} className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/20 flex items-center justify-center text-sm font-display font-bold text-white flex-shrink-0">
          A
        </div>
      </div>
    </header>
  );
}
