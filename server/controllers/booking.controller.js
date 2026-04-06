import { getDB } from "../config/db.js";
import { createBooking, getOwnerBookings } from "../models/booking.model.js";
import { lockSlot, markSlotBooked } from "../models/slot.model.js";

export async function bookSlot(req, res) {
  const db = getDB();

  try {
    const user_id = req.user.user_id;
    const { turf_id, slot_id } = req.body;

    // 🔥 START TRANSACTION
    await db.beginTransaction();

    // 1️⃣ Lock slot
    const slot = await lockSlot(slot_id);

    if (!slot) {
      await db.rollback();
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.is_booked) {
      await db.rollback();
      return res.status(400).json({ message: "Slot already booked" });
    }

    // 2️⃣ Create booking
    const bookingId = await createBooking({
      user_id,
      turf_id,
      slot_id,
      total_price: slot.price
    });

    // 3️⃣ Mark slot booked
    await markSlotBooked(slot_id, user_id);

    // 🔥 COMMIT
    await db.commit();

    res.json({
      success: true,
      message: "Booking successful",
      booking_id: bookingId
    });

  } catch (err) {
    await db.rollback();
    res.status(500).json({ error: err.message });
  }
}

export async function getUserBookings(req, res) {
  try {
    const db = getDB();
    const user_id = req.user.user_id;

    const [rows] = await db.query(
      `SELECT b.*, s.date, s.start_time, s.end_time
       FROM bookings b
       JOIN slots s ON b.slot_id = s.slot_id
       WHERE b.user_id = ?`,
      [user_id]
    );

    res.json({
      success: true,
      bookings: rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function cancelBooking(req, res) {
  try {
    const db = getDB();
    const user_id = req.user.user_id;
    const { booking_id } = req.params;

    // 1️⃣ find booking
    const [rows] = await db.query(
      "SELECT * FROM bookings WHERE booking_id=?",
      [booking_id]
    );

    const booking = rows[0];

    if (!booking || booking.user_id !== user_id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 2️⃣ update booking
    await db.query(
      "UPDATE bookings SET status='cancelled' WHERE booking_id=?",
      [booking_id]
    );

    // 3️⃣ free slot
    await db.query(
      "UPDATE slots SET is_booked=FALSE, booked_by=NULL WHERE slot_id=?",
      [booking.slot_id]
    );

    res.json({
      success: true,
      message: "Booking cancelled"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function getOwnerBookingsAPI(req, res) {
  try {
    const owner_id = req.user.user_id;

    // 🔥 role check
    // if (req.user.role !== "owner") {
    //   return res.status(403).json({
    //     message: "Only owners allowed"
    //   });
    // }

    const bookings = await getOwnerBookings(owner_id);

    res.json({
      success: true,
      bookings
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}