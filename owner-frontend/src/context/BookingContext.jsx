import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);

  // ✅ GET OWNER BOOKINGS
  const fetchOwnerBookings = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/bookings/owner`, { withCredentials: true });

      const data = res.data.bookings.map((b) => ({
        // ── identifiers ──────────────────────────────
        id:            b.booking_id,
        userId:        b.user_id,
        turfId:        b.turf_id,
        slotId:        b.slot_id,

        // ── booking fields ────────────────────────────
        status:        b.status,                       // "confirmed" | "cancelled" | "pending"
        totalPrice:    Number(b.total_price),
        paymentStatus: b.payment_status,               // "paid" | "pending" | "failed"
        createdAt:     b.created_at,

        // ── joined user fields ────────────────────────
        user:          b.user_name   ?? "Unknown",
        mobile:        b.user_mobile ?? "—",

        // ── joined turf fields ────────────────────────
        turf:          b.turf_name   ?? "—",

        // ── joined slot fields ────────────────────────
        date:          b.date,                         // "YYYY-MM-DD"
        slot:          b.start_time && b.end_time
                         ? `${b.start_time.slice(0, 5)}–${b.end_time.slice(0, 5)}`
                         : "—",

        // ── convenience aliases used by UI ───────────
        amount:        Number(b.total_price),
        paid:          b.payment_status === "paid",
      }));

      setBookings(data);

    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        fetchOwnerBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);