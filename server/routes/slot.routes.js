// routes/slot.routes.js

import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createSlots, deleteSlotController, updateSlotController } from "../controllers/slot.controller.js";
import { getTurfSlots } from "../controllers/slot.controller.js";

const router = express.Router();

router.post("/turfs/:turf_id/slots", verifyToken, createSlots);
router.get("/turfs/:turf_id/slots", getTurfSlots);
router.put("/update/:slot_id", verifyToken, updateSlotController);
router.delete("/delete/:slot_id", verifyToken, deleteSlotController);


export default router;