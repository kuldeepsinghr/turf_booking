import express from "express";
import {
  bookSlot,
  getUserBookings,
  cancelBooking,
  getOwnerBookingsAPI,
  getBookingById
} from "../controllers/booking.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-booking", verifyToken, bookSlot);
router.get("/my-bookings", verifyToken, getUserBookings);
router.put("/:booking_id/cancel", verifyToken, cancelBooking);
router.get("/owner", verifyToken, getOwnerBookingsAPI);
router.get("/booking/:id", verifyToken, getBookingById);

export default router;