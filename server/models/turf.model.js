import { getDB } from "../config/db.js";

// create turf
export async function createTurf(data) {
  const db = getDB();

  const {
    name,
    address,
    latitude,
    longitude,
    price_per_hour,
    description,
    owner_id
  } = data;

  const [result] = await db.query(
    `INSERT INTO turfs 
    (name, address, latitude, longitude, price_per_hour, description, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, address, latitude, longitude, price_per_hour, description, owner_id]
  );

  return result.insertId;
}

// get turf by id
export async function getTurfById(turfId) {
  const db = getDB();

  const [rows] = await db.query(
    "SELECT * FROM turfs WHERE turf_id = ?",
    [turfId]
  );

  return rows[0];
}

// get nearby turfs
export async function getNearbyTurfs(lat, lng, radius = 10) {
  const db = getDB();

  const [rows] = await db.query(
    `
    SELECT *, 
    (6371 * ACOS(
      COS(RADIANS(?)) 
      * COS(RADIANS(latitude)) 
      * COS(RADIANS(longitude) - RADIANS(?)) 
      + SIN(RADIANS(?)) 
      * SIN(RADIANS(latitude))
    )) AS distance
    FROM turfs
    HAVING distance < ?
    ORDER BY distance
    `,
    [lat, lng, lat, radius]
  );

  return rows;
}

// get turfs by owner
export async function getTurfsByOwner(owner_id) {
  const db = await getDB();

  const [rows] = await db.execute(
    "SELECT * FROM turfs WHERE owner_id = ? ORDER BY turf_id DESC",
    [owner_id]
  );

  return rows;
}