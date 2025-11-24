import express from "express";
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// GET semua review
router.get("/", getAllReviews);

// POST tambah review baru
router.post("/", createReview);

// PUT update review
router.put("/:id", updateReview);

// DELETE hapus review
router.delete("/:id", deleteReview);

export default router;
