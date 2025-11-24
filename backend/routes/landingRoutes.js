import express from "express";
import {
  getAllLandingContent,
  getLandingSection,
  updateLandingSection,
} from "../controllers/landingController.js";

const router = express.Router();

// ✅ GET semua section
router.get("/", getAllLandingContent);

// ✅ GET berdasarkan section (misalnya 'hero', 'visi', 'fasilitas', dll)
router.get("/:section", getLandingSection);

// ✅ UPDATE section tertentu
router.put("/:section", updateLandingSection);

export default router;
//