import {
  createTurf,
  getNearbyTurfs,
  getTurfById,
  getTurfsByOwner
} from "../models/turf.model.js";
import { getCoordinates } from "../services/geocode.service.js";



// 1️⃣ CREATE TURF (Owner)
export async function addTurf(req, res) {
  try {
    const owner_id = req.user.user_id; // from token
    // 🔥 convert address → lat/lng
    const { address } = req.body;
    const { latitude, longitude } = await getCoordinates(address);

    const turfId = await createTurf({
      ...req.body,
      owner_id,
      latitude,
      longitude
    });

    if (!latitude || !longitude) {
  return res.status(400).json({
    message: "Invalid address"
  });
}

    res.json({
      success: true,
      message: "Turf created",
      turf_id: turfId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// 2️⃣ GET NEARBY TURFS
export async function nearbyTurfs(req, res) {
  try {
    const { lat, lng, radius=10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude required"
      });
    }

    const turfs = await getNearbyTurfs(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius)
    );

    res.json({
      success: true,
      turfs
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// 3️⃣ GET TURF BY ID
export async function turfDetails(req, res) {
  try {
    const { turf_id } = req.params;

    const turf = await getTurfById(turf_id);

    res.json({
      success: true,
      turf
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 4️⃣ GET OWNER'S TURFS
export async function getOwnerTurfs(req, res) {
  try {
    const ownerId = req.user.user_id; // from JWT

    const turfs = await getTurfsByOwner(ownerId);

    res.json({
      success: true,
      turfs,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}