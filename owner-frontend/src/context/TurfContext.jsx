import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const TurfContext = createContext();

export const TurfProvider = ({ children }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ GET ALL TURFS
  const fetchTurfs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/turfs/my-turfs`,
        { withCredentials: true }
      );

      const data = res.data.turfs.map((t) => ({
        id: t.id,
        name: t.name,
        address: t.address,
        price: t.price_per_hour,
        slots: t.slots || 0,
        bookings: t.bookings || 0,
        status: t.status || "active",
        img: "⚽",
      }));

      setTurfs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load turfs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD TURF
  const addTurf = async (form) => {
    try {
      const res = await axios.post(
        `${API}/api/turfs/add-turf`,
        {
          name: form.name,
          address: form.address,
          price_per_hour: Number(form.price_per_hour),
          description: form.description,
        },
        { withCredentials: true }
      );

      toast.success(res.data?.message || "Turf created");

      await fetchTurfs();
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create turf";
      toast.error(message);
      return false;
    }
  };

  // ✅ TOGGLE STATUS (frontend for now)
  const toggleStatus = (id) => {
    setTurfs((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "active" ? "inactive" : "active",
            }
          : t
      )
    );
  };

  // ✅ DELETE TURF (frontend for now)
  const deleteTurf = (id) => {
    setTurfs((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  return (
    <TurfContext.Provider
      value={{
        turfs,
        loading,
        fetchTurfs,
        addTurf,
        toggleStatus,
        deleteTurf,
      }}
    >
      {children}
    </TurfContext.Provider>
  );
};

// ✅ custom hook
export const useTurf = () => useContext(TurfContext);