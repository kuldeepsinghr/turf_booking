import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { getBookingById } = useBooking();

  const qrRef = useRef(null);
  const [bookingData, setBookingData] = useState(null);

  // ✅ Redirect if no state and no id
  useEffect(() => {
    if (!state && !id) {
      navigate("/profile");
    }
  }, [state, id, navigate]);

  // ✅ Fetch booking if opened directly
  useEffect(() => {
    if (!state && id) {
      (async () => {
        const res = await getBookingById(id);
        if (res.success) {
          setBookingData(res.booking);
        } else {
          alert("Booking not found");
          navigate("/");
        }
      })();
    }
  }, [id, state, navigate]);

  // ✅ Normalize data
  const data = state
    ? {
        turf: state.turf,
        selectedSlots: state.selectedSlots,
        totalPrice: state.totalPrice,
        date: state.date,
        bookingId: state?.bookingIds?.[0],
      }
    : bookingData && {
        turf: {
          name: bookingData.turf_name,
          location: bookingData.address,
        },
        selectedSlots: [
          {
            time: bookingData.start_time,
            endTime: bookingData.end_time,
            price: bookingData.total_price,
          },
        ],
        totalPrice: bookingData.total_price,
        date: bookingData.date,
        bookingId: bookingData.booking_id,
      };

  // ✅ QR Code
  useEffect(() => {
    if (!qrRef.current || !data) return;

    const qrData = JSON.stringify({
      id: data.bookingId,
      venue: data.turf?.name,
      location: data.turf?.location,
      date: data.date,
      slots: data.selectedSlots?.map(
        (s) => `${s.time}-${s.endTime}`
      ),
      total: data.totalPrice,
    });

    QRCode.toCanvas(qrRef.current, qrData, { width: 90 });
  }, [data]);

  // ✅ Loading
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const { turf, selectedSlots, totalPrice, date, bookingId } = data;

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0c0e16] text-white p-6 flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black">Booking Confirmed</h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#13151f] border border-[#1f2235] rounded-2xl">

        {/* Top */}
        <div className="p-5 border-b border-[#1f2235]">
          <p className="font-bold text-lg">{turf.name}</p>
          <p className="text-xs text-gray-500">{turf.location}</p>

          <p className="mt-3 font-bold">{formattedDate}</p>

          {selectedSlots.map((s, i) => (
            <div key={i} className="flex justify-between text-sm mt-1">
              <span>{s.time} – {s.endTime}</span>
              <span className="text-emerald-400">₹{s.price}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="p-5">
          <canvas ref={qrRef} />

          <p className="mt-3 text-sm">Booking ID: {bookingId}</p>

          <div className="flex justify-between mt-4">
            <span>Total</span>
            <span className="text-emerald-400 font-bold">
              ₹{totalPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-emerald-400 text-black rounded-xl"
      >
        Back Home
      </button>
    </div>
  );
}