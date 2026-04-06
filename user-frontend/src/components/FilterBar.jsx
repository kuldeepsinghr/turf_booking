import React from "react";
import { SlidersHorizontal } from "lucide-react";

const sports = ["All", "Football", "Cricket", "Hockey", "Basketball", "Volleyball"];
const sorts = ["Nearest", "Top Rated", "Price: Low", "Price: High"];

export default function FilterBar({ activeSport, setActiveSport, activeSort, setActiveSort }) {
  return (
    <div className="border-b border-[#1f2d1f] bg-[#0a0f0a]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
        {/* Sport filters */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                activeSport === sport
                  ? "bg-[#a3e635] text-[#0a0f0a] font-bold shadow-lg shadow-[#a3e635]/20"
                  : "bg-[#161e16] text-[#8ba98b] border border-[#1f2d1f] hover:border-[#16a34a] hover:text-[#e8f5e8]"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#1f2d1f] flex-shrink-0" />

        {/* Sort */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal size={14} className="text-[#4b6b4b]" />
          <div className="flex gap-1.5">
            {sorts.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSort(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                  activeSort === s
                    ? "bg-[#161e16] border border-[#16a34a] text-[#a3e635]"
                    : "text-[#4b6b4b] hover:text-[#8ba98b]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
