import { getDB } from "../config/db.js";

export async function logNotification(data) {
  const db = getDB();

  const {
    booking_id,
    user_id,
    owner_id,
    channel,
    recipient_type,
    message,
    status
  } = data;

  await db.query(
    `INSERT INTO notification_logs
    (booking_id, user_id, owner_id, channel, recipient_type, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      booking_id,
      user_id,
      owner_id,
      channel,
      recipient_type,
      message,
      status
    ]
  );
}