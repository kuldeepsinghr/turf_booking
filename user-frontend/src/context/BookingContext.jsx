import { createContext, useContext, useState } from "react";
import axios from "axios";

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export default function BookingProvider({ children }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ 1. Create Booking
  const createBooking = async ({ turf_id, slot_id }) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/api/bookings/create-booking`,
        { turf_id, slot_id },
        { withCredentials: true }
      );

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Booking failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ 2. Get My Bookings
  const fetchMyBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/bookings/my-bookings`,
        { withCredentials: true }
      );

      setBookings(res.data.bookings);

      return {
        success: true,
        bookings: res.data.bookings,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch bookings",
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ 3. Cancel Booking
  const cancelBooking = async (booking_id) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${BASE_URL}/api/bookings/${booking_id}/cancel`,
        {},
        { withCredentials: true }
      );

      // remove cancelled booking locally
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === booking_id
            ? { ...b, status: "cancelled" }
            : b
        )
      );

      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Cancel failed",
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        createBooking,
        fetchMyBookings,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}