import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(404).json({ success: false, message: "User tidak ditemukan" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Password salah" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Kesalahan server" });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ success: false, message: "Semua field wajib diisi" });

  try {
    const [exist] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exist.length > 0) return res.status(409).json({ success: false, message: "Email sudah terdaftar" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')", [name, email, hashed]);

    res.json({ success: true, message: "Registrasi berhasil" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Gagal mendaftar" });
  }
};
