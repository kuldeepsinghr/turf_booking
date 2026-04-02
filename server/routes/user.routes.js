import express from "express";
import {
  sendOtp,
  verifyOtp,
  getProfile
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/profile", verifyToken, getProfile);

export default router;