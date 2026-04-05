import express from "express";
import {
  addTurf,
  deleteTurfController,
  getOwnerTurfs,
  nearbyTurfs,
  turfDetails,
  updateTurfController
} from "../controllers/turf.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// owner only
router.post("/add-turf", verifyToken, addTurf);
router.get("/my-turfs", verifyToken, getOwnerTurfs);
// update turf
router.put("/update-turf/:id", verifyToken, updateTurfController);
  
// delete turf
router.delete("/delete-turf/:id", verifyToken, deleteTurfController);

// user
router.get("/nearby", nearbyTurfs);
router.get("/:turf_id", turfDetails);

export default router;