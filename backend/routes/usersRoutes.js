// === routes/usersRoutes.js ===
import express from "express";
import db from "../config/db.js";
import { getAllUsers, deleteUser } from "../controllers/usersController.js";

const router = express.Router();

// === POST Tambah User ===
router.post("/", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, password, role || "user"], (err, result) => {
    if (err) {
      console.error("❌ Gagal menambahkan user:", err);
      return res
        .status(500)
        .json({ message: "Gagal menambahkan user", error: err });
    }
    console.log("✅ User berhasil ditambahkan:", result.insertId);
    res.status(201).json({ id: result.insertId, name, email, role });
  });
});

// === GET semua user ===
router.get("/", getAllUsers);

// === DELETE user ===
router.delete("/:id", deleteUser);

export default router;
//