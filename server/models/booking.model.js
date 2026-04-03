import { getDB } from "../config/db.js";

export async function createBooking(data) {
  const db = getDB();

  const [result] = await db.query(
    `INSERT INTO bookings 
    (user_id, turf_id, slot_id, total_price, payment_status)
    VALUES (?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.turf_id,
      data.slot_id,
      data.total_price,
      "pending"
    ]
  );

  return result.insertId;
}

export async function getOwnerBookings(owner_id) {
  const db = getDB();

  const [rows] = await db.query(
    `
    SELECT 
      b.booking_id,
      b.status,
      b.payment_status,
      b.total_price,
      b.created_at,

      u.name AS user_name,
      u.mobile AS user_mobile,

      t.name AS turf_name,

      s.date,
      s.start_time,
      s.end_time

    FROM bookings b

    JOIN users u ON b.user_id = u.user_id
    JOIN turfs t ON b.turf_id = t.turf_id
    JOIN slots s ON b.slot_id = s.slot_id

    WHERE t.owner_id = ?

    ORDER BY b.created_at DESC
    `,
    [owner_id]
  );

  return rows;
}