import { useEffect } from "react";
import BookingCard from "../components/BookingCard";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { bookings, fetchMyBookings } = useBooking();
  const { user } = useAuth(); // 👈 get logged-in user

  useEffect(() => {
    fetchMyBookings();
  }, []);

  if (!user) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-turf-dark text-white">

      {/* Header */}
      <div className="px-4 py-5 border-b border-turf-border">
        <h1 className="text-xl font-bold">My Profile</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Profile Card */}
        <div className="bg-turf-card border border-turf-border rounded-2xl p-5 mb-6 flex items-center gap-4">
          
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-turf-accent to-green-700 flex items-center justify-center text-lg font-bold text-black">
            {user.name?.[0]}
          </div>

          {/* Info */}
          <div>
            <h2 className="font-bold text-white">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500">{user.mobile}</p>
          </div>
        </div>

        {/* Booking History */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
            Booking History
          </h2>

          <div className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet</p>
            ) : (
              bookings.map((b) => (
                <BookingCard key={b.booking_id} booking={b} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}