import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext"; 

const API = import.meta.env.VITE_API_URL;

const TurfContext = createContext();

export const TurfProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ GET ALL TURFS
  const fetchTurfs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/turfs/my-turfs`, {
        withCredentials: true,
      });

      const data = res.data.turfs.map((t) => ({
        id: t.turf_id,
        name: t.name,
        address: t.address,
        price: t.price_per_hour,
        description: t.description || "",   // ✅ BUG FIX: was missing, caused edit form to always show empty description
        slots: t.slots || 0,
        bookings: t.bookings || 0,
        status: t.is_active ? "active" : "inactive",
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
      const message = err.response?.data?.message || "Failed to create turf";
      toast.error(message);
      return false;
    }
  };

  // ✅ UPDATE TURF
  const updateTurf = async (id, updatedData) => {
    try {
      const res = await axios.put(
        `${API}/api/turfs/update-turf/${id}`,
        updatedData,
        { withCredentials: true }
      );

      toast.success(res.data?.message || "Turf updated");
      await fetchTurfs();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update turf";
      toast.error(message);
      return false;
    }
  };

  // ✅ TOGGLE STATUS
  // IMPORTANT: send the full turf body — many backends ignore PATCH-style
  // partial updates on a PUT route and silently keep the old value.
  const toggleStatus = async (id, currentStatus) => {
    const is_active = currentStatus === "active" ? 0 : 1;
    const newStatus = is_active ? "active" : "inactive";

    // Find the full turf so we can send all fields
    const turf = turfs.find((t) => t.id === id);
    if (!turf) return;

    // Optimistic update
    setTurfs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await axios.put(
        `${API}/api/turfs/update-turf/${id}`,
        {
          name: turf.name,
          address: turf.address,
          price_per_hour: Number(turf.price),
          description: turf.description || "",
          is_active,                           // ← the only field actually changing
        },
        { withCredentials: true }
      );

      // Re-fetch so local state matches server truth
      await fetchTurfs();
      toast.success(`Turf marked as ${newStatus}`);
    } catch (err) {
      // Revert optimistic update on failure
      setTurfs((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: currentStatus } : t))
      );
      toast.error("Failed to update status");
    }
  };

  // ✅ DELETE TURF
  const deleteTurf = async (id) => {
    if (!window.confirm("Delete this turf?")) return;

    try {
      const res = await axios.delete(`${API}/api/turfs/delete-turf/${id}`, {
        withCredentials: true,
      });

      toast.success(res.data?.message || "Turf deleted");
      setTurfs((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete turf";
      toast.error(message);
    }
  };

  useEffect(() => {
  if (user) {
    fetchTurfs();   // ✅ only when logged in
  }
}, [user]);

  return (
    <TurfContext.Provider
      value={{
        turfs,
        loading,
        fetchTurfs,
        addTurf,
        toggleStatus,
        updateTurf,
        deleteTurf,
      }}
    >
      {children}
    </TurfContext.Provider>
  );
};

export const useTurf = () => useContext(TurfContext);
