// models/slot.model.js

import { getDB } from "../config/db.js";

export async function insertSlots(slots) {
  const db = getDB();

  const values = slots.map(slot => [
    slot.turf_id,
    slot.date,
    slot.start_time,
    slot.end_time,
    slot.price || null
  ]);

  const query = `
    INSERT INTO slots 
    (turf_id, date, start_time, end_time, price)
    VALUES ?
  `;

  await db.query(query, [values]);
}


export async function getSlotsByTurfAndDate(turf_id, date) {
  const db = getDB();

  const [rows] = await db.query(
    `SELECT 
        slot_id,
        date,
        start_time,
        end_time,
        price,
        is_booked
     FROM slots
     WHERE turf_id = ? AND date = ?
     ORDER BY start_time ASC`,
    [turf_id, date]
  );

  return rows;
}

// lock slot (prevent double booking)
export async function lockSlot(slot_id) {
  const db = getDB();

  const [rows] = await db.query(
    "SELECT * FROM slots WHERE slot_id = ? FOR UPDATE",
    [slot_id]
  );

  return rows[0];
}

// mark slot booked
export async function markSlotBooked(slot_id, user_id) {
  const db = getDB();

  await db.query(
    "UPDATE slots SET is_booked = TRUE, booked_by=? WHERE slot_id=?",
    [user_id, slot_id]
  );
}

