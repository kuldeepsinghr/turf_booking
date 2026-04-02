import express from "express";
import {
  registerOwner,
  getOwnerProfile,
  updateOwnerProfile,
  loginOwner
} from "../controllers/owner.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerOwner);
router.get("/me", verifyToken, getOwnerProfile);
router.put("/me", verifyToken, updateOwnerProfile);
router.post("/login", loginOwner);

export default router;