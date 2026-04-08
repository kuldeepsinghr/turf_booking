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
export async function getTurfById(turfId, date) {
  const db = getDB();

  const [turfRows] = await db.query(
    `
    SELECT 
      t.*, 
      o.owner_id, o.name AS owner_name, o.email, o.mobile
    FROM turfs t
    JOIN owners o ON t.owner_id = o.owner_id
    WHERE t.turf_id = ?
    `,
    [turfId]
  );

  if (!turfRows.length) return null;

  const turf = turfRows[0];

  const [slotRows] = await db.query(
    `
    SELECT 
      slot_id, \`date\`, start_time, end_time, is_booked, price
    FROM slots   -- ✅ FIXED HERE
    WHERE turf_id = ?
    ${date ? "AND \`date\` = ?" : ""}
    ORDER BY start_time
    `,
    date ? [turfId, date] : [turfId]
  );

  return {
    ...turf,
    owner: {
      owner_id: turf.owner_id,
      name: turf.owner_name,
      email: turf.email,
      mobile: turf.mobile,
    },
    slots: slotRows,
  };
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

// update turf
export async function updateTurf(turfId, owner_id, data) {
  const db = getDB();

  const {
    name,
    address,
    latitude,
    longitude,
    price_per_hour,
    description,
    is_active,
  } = data;

  const [result] = await db.query(
    `UPDATE turfs SET 
      name = COALESCE(?, name),
      address = COALESCE(?, address),
      latitude = COALESCE(?, latitude),
      longitude = COALESCE(?, longitude),
      price_per_hour = COALESCE(?, price_per_hour),
      description = COALESCE(?, description),
      is_active = COALESCE(?, is_active)
    WHERE turf_id = ? AND owner_id = ?`,
    [
      name,
      address,
      latitude,
      longitude,
      price_per_hour,
      description,
      is_active,
      turfId,
      owner_id,
    ]
  );

  return result;
}

// delete turf
export async function deleteTurf(turfId, owner_id) {
  const db = getDB();

  const [result] = await db.query(
    `DELETE FROM turfs WHERE turf_id = ? AND owner_id = ?`,
    [turfId, owner_id]
  );

  return result;
}