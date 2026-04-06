import BookingCard from "../components/BookingCard";

const user = {
  name: "Aditya Sharma",
  email: "aditya@gmail.com",
  location: "Mumbai, India",
};

const bookings = [
  {
    id: 1,
    turfName: "Andheri Sports Arena",
    location: "Andheri West",
    date: "Sunday, 6 April",
    slots: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM"],
    total: 1700,
    status: "Confirmed",
  },
  {
    id: 2,
    turfName: "Bandra Turf Club",
    location: "Bandra",
    date: "Monday, 7 April",
    slots: ["8:00 PM - 9:00 PM"],
    total: 1200,
    status: "Completed",
  },
];

export default function Profile() {
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
            {user.name[0]}
          </div>

          {/* Info */}
          <div>
            <h2 className="font-bold text-white">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500">{user.location}</p>
          </div>
        </div>

        {/* Booking History */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
            Booking History
          </h2>

          <div className="space-y-3">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}