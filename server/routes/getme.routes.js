import express from "express";
import { getMe } from "../controllers/getme.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);

export default router;