import express from "express";
import { createBooking, getBookings, updateBooking, deleteBooking, getBookingStatus } from "../controllers/bookingsController.js";

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

// 👉 HANYA INI endpoint status
router.get("/:id/status", getBookingStatus);

export default router;
