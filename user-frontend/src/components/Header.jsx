import React from "react";
import { MapPin, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Header({ onSearch, searchQuery }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-[#1f2d1f] bg-[#0a0f0a]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-[#a3e635] rounded-lg flex items-center justify-center">
            <span className="text-[#0a0f0a] font-display font-800 text-sm font-bold">T</span>
          </div>
          <span className="font-display font-bold text-lg text-[#e8f5e8] tracking-tight">
            Turf<span className="text-[#a3e635]">Book</span>
          </span>
        </div>

        {/* Location */}
        <div className="hidden sm:flex items-center gap-1.5 text-sm text-[#8ba98b] ml-2">
          <div className="dot-live flex-shrink-0" />
          <MapPin size={13} className="text-[#a3e635]" />
          <span className="font-medium text-[#e8f5e8]">Mumbai, MH</span>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b6b4b]" />
          <input
            type="text"
            placeholder="Search turf, area..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#161e16] border border-[#1f2d1f] rounded-xl text-sm text-[#e8f5e8] placeholder-[#4b6b4b] focus:outline-none focus:border-[#16a34a] transition-colors"
          />
        </div>

        {/* Notif */}
        <button className="relative p-2.5 rounded-xl bg-[#161e16] border border-[#1f2d1f] hover:border-[#16a34a] transition-colors">
          <Bell size={16} className="text-[#8ba98b]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#a3e635] rounded-full" />
        </button>

        {/* Avatar */}
        <div onClick={() => navigate("/profile")} className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#14532d] flex items-center justify-center text-sm font-display font-bold text-white flex-shrink-0">
          A
        </div>
      </div>
    </header>
  );
}
