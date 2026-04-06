import React from "react";
import { SlidersHorizontal } from "lucide-react";

const sports = ["All", "Football", "Cricket", "Hockey", "Basketball", "Volleyball"];
const sorts = ["Nearest", "Top Rated", "Price: Low", "Price: High"];

export default function FilterBar({ activeSport, setActiveSport, activeSort, setActiveSort }) {
  return (
    <div className="border-b border-turf-border bg-turf-dark/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">

        {/* Sport filters */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                activeSport === sport
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold shadow-lg shadow-green-500/20"
                  : "bg-turf-card text-gray-400 border border-turf-border hover:border-green-400 hover:text-white"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-turf-border flex-shrink-0" />

        {/* Sort */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal size={14} className="text-gray-500" />

          <div className="flex gap-1.5">
            {sorts.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSort(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                  activeSort === s
                    ? "bg-turf-card border border-green-400 text-green-400"
                    : "text-gray-500 hover:text-gray-300"
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