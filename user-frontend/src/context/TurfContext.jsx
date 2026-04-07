import { createContext, useContext, useState } from "react";
import axios from "axios";

const TurfContext = createContext();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TurfProvider = ({ children }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNearbyTurfs = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await axios.get(
            `${BASE_URL}/api/turfs/nearby?lat=${latitude}&lng=${longitude}&radius=10`
          );

          const formatted = res.data.turfs.map((t) => ({
            id: t.turf_id,
            name: t.name,
            location: t.address,
            price: t.price_par_hour,
            distance: t.distance.toFixed(1) + " km",

            // UI fallback
            image:
              "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
            rating: 4.2,
            reviews: 20,
            sport: ["Football"],
            size: "5v5",
            amenities: ["Parking", "Floodlights"],
            available: true,
          }));

          setTurfs(formatted);
        } catch (err) {
          setError("Failed to fetch turfs");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  return (
    <TurfContext.Provider
      value={{
        turfs,
        loading,
        error,
        fetchNearbyTurfs,
      }}
    >
      {children}
    </TurfContext.Provider>
  );
};

export const useTurf = () => useContext(TurfContext);