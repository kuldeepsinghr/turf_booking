import { createContext, useContext, useState } from "react";
import axios from "axios";

const TurfContext = createContext();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TurfProvider = ({ children }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTurf, setSelectedTurf] = useState(null);

  // ✅ FORMAT TIME (ADDED)
  const formatTime = (time) => {
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${m} ${ampm}`;
  };

  // ✅ FETCH NEARBY TURFS
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
            `${BASE_URL}/api/turfs/nearby`,
            {
              params: {
                lat: latitude,
                lng: longitude,
                radius: 10,
              },
            }
          );

          const formatted = res.data.turfs.map((t) => ({
            id: t.turf_id,
            name: t.name,
            location: t.address,
            price: t.price_par_hour,
            distance: t.distance.toFixed(1) + " km",

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

  // ✅ FETCH SINGLE TURF WITH REAL SLOTS
  const fetchTurfById = async (id, date) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/api/turfs/${id}`, {
        params: { date },
      });

      const t = res.data.turf;

      const formatted = {
        id: t.turf_id,
        name: t.name,
        location: t.address,
        price: t.price_par_hour,

        image:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
        rating: 4.2,
        reviews: 20,
        size: "5v5",
        surface: "Turf",
        openTime: "6 AM",
        closeTime: "11 PM",
        amenities: ["Parking", "Floodlights"],

        // ✅ REAL SLOTS FROM BACKEND
        slots: t.slots.map((s) => ({
          id: s.slot_id,
          time: formatTime(s.start_time),
          endTime: formatTime(s.end_time),
          price: Number(s.price),
          status: s.is_booked ? "booked" : "available",
          date: s.date,
        })),

        // ✅ OWNER INFO
        owner: t.owner,
      };

      setSelectedTurf(formatted);
    } catch (err) {
      setError("Failed to fetch turf details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TurfContext.Provider
      value={{
        turfs,
        loading,
        error,
        fetchNearbyTurfs,
        selectedTurf,
        fetchTurfById,
      }}
    >
      {children}
    </TurfContext.Provider>
  );
};

export const useTurf = () => useContext(TurfContext);