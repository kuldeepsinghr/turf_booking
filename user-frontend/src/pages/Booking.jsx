import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useEffect } from "react";

export default function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { fetchMyBookings, bookings } = useBooking();

  useEffect(() => {
  if (!state) {
    fetchMyBookings();
  }
}, []);

if (!state && bookings.length === 0) {
  return <div>Loading...</div>;
}

  const { turf, selectedSlots, totalPrice, date } = state;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Confirmed ✅</h1>

      <div className="bg-[#1a1d27] p-4 rounded-xl">
        <h2 className="font-bold">{turf.name}</h2>
        <p className="text-gray-400">{turf.location}</p>

        <p className="mt-3">Date: {date}</p>

        <div className="mt-3">
          {selectedSlots.map((s, i) => (
            <div key={i}>
              {s.time} - {s.endTime} → ₹{s.price}
            </div>
          ))}
        </div>

        <h3 className="mt-4 font-bold text-emerald-400">
          Total: ₹{totalPrice}
        </h3>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-emerald-400 text-black px-4 py-2 rounded"
      >
        Back Home
      </button>
    </div>
  );
}