// controllers/slot.controller.js

import { insertSlots } from "../models/slot.model.js";
import { getTurfById } from "../models/turf.model.js";
import { getSlotsByTurfAndDate } from "../models/slot.model.js";


export async function createSlots(req, res) {
  try {
    const owner_id = req.user.user_id;
    const { turf_id } = req.params;
    const { slots } = req.body;
    const turf = await getTurfById(turf_id);

    if (!slots || slots.length === 0) {
      return res.status(400).json({
        message: "Slots are required"
      });
    }

if (!turf || turf.owner_id !== owner_id) {
  return res.status(403).json({
    message: "Not authorized for this turf"
  });
}

    // 🔥 attach turf_id to each slot
    const formattedSlots = slots.map(slot => ({
      ...slot,
      turf_id
    }));

    await insertSlots(formattedSlots);

    res.json({
      success: true,
      message: "Slots created successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function getTurfSlots(req, res) {
  try {
    const { turf_id } = req.params;
    const { date } = req.query;

    // ✅ validation
    if (!date) {
      return res.status(400).json({
        message: "Date is required"
      });
    }

    const slots = await getSlotsByTurfAndDate(turf_id, date);

    res.json({
      success: true,
      slots
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}