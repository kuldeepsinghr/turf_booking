import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const SlotContext = createContext();

export const SlotProvider = ({ children }) => {
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ GET SLOTS
  // INFINITE LOOP FIX: wrapped in useCallback so the function reference
  // is stable across renders. Without this, SlotsPage's useEffect sees
  // a new `fetchSlots` on every render and re-fires endlessly (501 errors).
  //
  // URL FIX: changed from /api/slots/turfs/:turf_id  →  /api/slots/:turf_id
  // Your backend controller registers getTurfSlots on "/:turf_id" (no "turfs/" prefix).
  // If your routes file uses a different prefix, update the URL here to match.
  const fetchSlots = useCallback(async (turf_id, date) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/slots/turfs/${turf_id}/slots?date=${date}`,   // ← fixed URL
        { withCredentials: true }
      );

      const data = res.data.slots ?? [];
      setSlots(data);
      return data;   // returned so SlotsPage can cache per turfId|date

    } catch (err) {
      // Only toast on non-404 to avoid spamming when a date has no slots yet
      if (err.response?.status !== 404) {
        toast.error("Failed to load slots");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // no deps — API and axios are module-level constants

  // ✅ CREATE SLOTS (bulk)
  const createSlots = useCallback(async (turf_id, slotsData) => {
    try {
      const res = await axios.post(
        `${API}/api/slots/turfs/${turf_id}/slots`,
        { slots: slotsData },
        { withCredentials: true }
      );

      toast.success(res.data?.message || "Slots created");
      return true;

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create slots");
      return false;
    }
  }, []);

  // ✅ UPDATE SLOT (price edit)
  const updateSlot = useCallback(async (slot_id, data) => {
    try {
      await axios.put(
        `${API}/api/slots/update/${slot_id}`,
        data,
        { withCredentials: true }
      );

      toast.success("Slot updated");
      return true;

    } catch (err) {
      toast.error("Failed to update slot");
      return false;
    }
  }, []);

  // ✅ DELETE SLOT
  const deleteSlot = useCallback(async (slot_id) => {
    try {
      await axios.delete(
        `${API}/api/slots/delete/${slot_id}`,
        { withCredentials: true }
      );

      setSlots((prev) => prev.filter((s) => s.slot_id !== slot_id));
      toast.success("Slot deleted");

    } catch (err) {
      toast.error("Failed to delete slot");
    }
  }, []);

  return (
    <SlotContext.Provider
      value={{ slots, loading, fetchSlots, createSlots, updateSlot, deleteSlot }}
    >
      {children}
    </SlotContext.Provider>
  );
};

export const useSlot = () => useContext(SlotContext);
