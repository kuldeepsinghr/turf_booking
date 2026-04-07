import { useState, useEffect } from "react";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import TurfCard from "../components/TurfCard";
import { useNavigate } from "react-router-dom";
import { useTurf } from "../context/TurfContext";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeSport, setActiveSport] = useState("All");
  const [sortBy, setSortBy] = useState("Nearest");

  const { turfs, loading, error, fetchNearbyTurfs } = useTurf();

  const navigate = useNavigate();

  useEffect(() => {
    fetchNearbyTurfs();
  }, []);

  const filtered = turfs
    .filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase());

      return matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low") return a.price - b.price;
      if (sortBy === "Price: High") return b.price - a.price;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  return (
    <div className="min-h-screen bg-turf-dark text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-green-500/10 blur-[120px]" />

      <div className="relative z-10">
        <Header searchQuery={search} onSearch={setSearch} />

        <FilterBar
          activeSport={activeSport}
          setActiveSport={setActiveSport}
          activeSort={sortBy}
          setActiveSort={setSortBy}
        />

        <div className="max-w-6xl mx-auto px-4 py-5">
          {loading ? (
            <p className="text-center text-gray-400">
              Fetching nearby turfs...
            </p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400">No turfs found</p>
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