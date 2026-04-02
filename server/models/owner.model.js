import { getDB } from "../config/db.js";

// create owner
export async function createOwner(name, mobile, email, password) {
  const db = getDB();

  const [result] = await db.query(
    `INSERT INTO owners (name, mobile, email, password)
     VALUES (?, ?, ?, ?)`,
    [name, mobile, email, password]
  );

  return result.insertId;
}

// find by email
export async function findOwnerByEmail(email) {
  const db = getDB();

  const [rows] = await db.query(
    "SELECT * FROM owners WHERE email = ?",
    [email]
  );

  return rows[0];
}

// find by id
export async function findOwnerById(ownerId) {
  const db = getDB();

  const [rows] = await db.query(
    "SELECT owner_id, name, mobile, email, created_at FROM owners WHERE owner_id = ?",
    [ownerId]
  );

  return rows[0];
}

// update owner
export async function updateOwner(ownerId, name, mobile) {
  const db = getDB();

  await db.query(
    "UPDATE owners SET name=?, mobile=? WHERE owner_id=?",
    [name, mobile, ownerId]
  );
}

// count turfs
export async function getOwnerTurfCount(ownerId) {
  const db = getDB();

  const [rows] = await db.query(
    "SELECT COUNT(*) as total FROM turfs WHERE owner_id=?",
    [ownerId]
  );

  return rows[0].total;
}