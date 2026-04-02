import express from "express";
import {
  addTurf,
  nearbyTurfs,
  turfDetails
} from "../controllers/turf.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// owner only
router.post("/add-turf", verifyToken, addTurf);

// user
router.get("/nearby", nearbyTurfs);
router.get("/:turf_id", turfDetails);

export default router;