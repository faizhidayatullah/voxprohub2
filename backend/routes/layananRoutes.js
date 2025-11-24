import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  getAllLayanan,
  getLayananById,
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from "../controllers/layananController.js";

const router = express.Router();

// Pastikan folder uploads ada
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Konfigurasi Multer (untuk upload file)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ==========================
// CRUD utama layanan
// ==========================
router.get("/", getAllLayanan);
router.get("/:id", getLayananById);
router.post("/", createLayanan); // tidak lagi upload di sini
router.put("/:id", updateLayanan);
router.delete("/:id", deleteLayanan);

// ==========================
// Route khusus upload gambar
// ==========================
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Tidak ada file yang diupload." });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  return res.status(200).json({ imageUrl });
});

export default router;
