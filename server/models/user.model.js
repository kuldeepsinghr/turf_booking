import { getDB } from "../config/db.js";

// find user
export async function findUserById(userId) {
  const db = getDB();
  const [rows] = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId]
  );
  return rows[0];
}

export async function findUserByMobile(mobile) {
  const db = getDB();
  const [rows] = await db.query(
    "SELECT * FROM users WHERE mobile = ?",
    [mobile]
  );
  return rows[0];
}

// create user
export async function createUser(name, mobile) {
  const db = getDB();
  const [result] = await db.query(
    "INSERT INTO users (name, mobile) VALUES (?, ?)",
    [name, mobile]
  );
  return result.insertId;
}

// save OTP
export async function saveOTP(mobile, otp, expiresAt) {
  const db = getDB();
  await db.query(
    "INSERT INTO otp_verifications (mobile, otp, expires_at) VALUES (?, ?, ?)",
    [mobile, otp, expiresAt]
  );
}

// verify OTP
export async function getValidOTP(mobile, otp) {
  const db = getDB();
  const [rows] = await db.query(
    `SELECT * FROM otp_verifications 
     WHERE mobile=? AND otp=? AND is_verified=FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [mobile, otp]
  );
  return rows[0];
}

// mark OTP used
export async function markOTPVerified(id) {
  const db = getDB();
  await db.query(
    "UPDATE otp_verifications SET is_verified=TRUE WHERE id=?",
    [id]
  );
}