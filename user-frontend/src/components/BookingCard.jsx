import { MapPin, Clock } from "lucide-react";

export default function BookingCard({ booking, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-turf-card border border-turf-border rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition"
    >
      
      {/* Top */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-bold">
            {booking.turf_name}
          </h3>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {booking.address}
          </p>
        </div>

        <span className="text-xs px-2 py-1 rounded-md bg-turf-accent/10 text-turf-accent font-mono">
          {booking.status}
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-2">
        📅 {booking.date}
      </p>

      <div className="mb-3">
        <span className="px-2 py-1 text-xs bg-turf-muted border border-turf-border rounded-md text-gray-300">
          <Clock className="w-3 h-3 inline mr-1" />
          {booking.start_time} - {booking.end_time}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Total Paid</span>
        <span className="text-turf-accent font-bold">
          ₹{booking.total_price}
        </span>
      </div>
    </div>
  );
}