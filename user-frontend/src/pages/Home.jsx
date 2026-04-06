import { useState } from "react";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import TurfCard from "../components/TurfCard";
import { useNavigate } from "react-router-dom";
import { turfs } from "../data/turfs";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeSport, setActiveSport] = useState("All");
  const [sortBy, setSortBy] = useState("Nearest");
  const navigate = useNavigate();

  const filtered = turfs
    .filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase());

      const matchSport =
        activeSport === "All" || t.sport.includes(activeSport);

      return matchSearch && matchSport;
    })
    .sort((a, b) => {
      if (sortBy === "Top Rated") return b.rating - a.rating;
      if (sortBy === "Price: Low") return a.price - b.price;
      if (sortBy === "Price: High") return b.price - a.price;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  return (
    <div className="min-h-screen bg-turf-dark text-white relative overflow-hidden">

      {/* 🔥 Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-green-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <Header searchQuery={search} onSearch={setSearch} />

        <FilterBar
          activeSport={activeSport}
          setActiveSport={setActiveSport}
          activeSort={sortBy}
          setActiveSort={setSortBy}
        />

        <div className="max-w-6xl mx-auto px-4 py-5">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-400">No turfs found</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((turf, i) => (
                <TurfCard
                  key={turf.id}
                  turf={turf}
                  index={i}
                  onClick={() => navigate(`/turf/${turf.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}