import { MapPin, Clock } from "lucide-react";

export default function BookingCard({ booking }) {
  return (
    <div className="bg-turf-card border border-turf-border rounded-2xl p-4">
      
      {/* Top */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-bold">{booking.turfName}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {booking.location}
          </p>
        </div>

        <span className="text-xs px-2 py-1 rounded-md bg-turf-accent/10 text-turf-accent font-mono">
          {booking.status}
        </span>
      </div>

      {/* Date */}
      <p className="text-sm text-gray-300 mb-2">
        📅 {booking.date}
      </p>

      {/* Slots */}
      <div className="flex flex-wrap gap-2 mb-3">
        {booking.slots.map((s, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs bg-turf-muted border border-turf-border rounded-md text-gray-300"
          >
            <Clock className="w-3 h-3 inline mr-1" />
            {s}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Total Paid</span>
        <span className="text-turf-accent font-bold">₹{booking.total}</span>
      </div>
    </div>
  );
}