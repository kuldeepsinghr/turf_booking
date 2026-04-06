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
    <div className="min-h-screen bg-[#0a0f0a] text-white">
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
  );
}