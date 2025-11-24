import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "dotenv/config";
import fetch from "node-fetch";
import pool from "./config/db.js";

// === Import semua routes ===
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import landingRoutes from "./routes/landingRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import layananRoutes from "./routes/layananRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
const app = express();

// === FIX __dirname untuk ES Module ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CORS (IZINKAN FRONTEND DI 5173) ===
const allowedOrigins = [
  "http://localhost:5173",
  // "http://localhost:3000", // kalau mau boleh juga, tinggal un-comment
];

const BOOBLE_BASE = process.env.BOOBLE_BASE_URL;
const APP_KEY = process.env.BOOBLE_APP_KEY;
const APP_SECRET = process.env.BOOBLE_APP_SECRET;

async function getBoobleToken() {
  const clientId = process.env.BOOBLE_CLIENT_ID;
  const clientSecret = process.env.BOOBLE_CLIENT_SECRET;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${process.env.BOOBLE_BASE_URL}/auth/token`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "app-key": process.env.BOOBLE_APP_KEY,
      "app-secret": process.env.BOOBLE_APP_SECRET,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log("DEBUG TOKEN:", data);

  if (!res.ok || data.status !== true) {
    console.error("Token error:", data);
    throw new Error("Gagal generate token");
  }

  return data.data.accessToken;
}

export default getBoobleToken;

app.use(
  cors({
    origin(origin, callback) {
      // origin bisa null kalau request dari tools / Postman
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// Paksa header CORS di semua response (supaya nggak ada yang override)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || allowedOrigins[0]);
  }

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// === Body parser ===
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// === Pastikan folder uploads ada ===
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 Folder 'uploads' dibuat secara otomatis.");
}

// === Serve folder uploads secara publik ===
app.use("/uploads", express.static(uploadDir));

// === Routes utama ===
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/landing", landingRoutes);
app.use("/api/theme", themeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/layanan", layananRoutes);
app.use("/api/reviews", reviewRoutes);

// === Root endpoint ===
app.get("/", (req, res) => res.send("✅ Backend VoxProHub aktif dan berjalan!"));

// app.get("/api/bookings/:id/status", async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const [rows] = await pool.query("SELECT paymentStatus FROM bookings WHERE id = ?", [bookingId]);

//     if (!rows.length) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     res.json({
//       success: true,
//       paymentStatus: rows[0].paymentStatus,
//     });
//   } catch (err) {
//     console.error("GET /api/bookings/:id/status error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// app.post("/api/bookings", async (req, res) => {
//   try {
//     const { nama, telepon, ruangan, tanggal, jam_mulai, durasi, catatan, subtotal, discount, total, paymentStatus, slots } = req.body;

//     let mainDate = tanggal || null;
//     let mainStart = jam_mulai || null;
//     let mainDuration = durasi || 1;

//     if ((!mainDate || !mainStart) && Array.isArray(slots) && slots.length > 0) {
//       const first = slots[0];
//       mainDate = first.date || null;

//       if (first.startHour != null) {
//         const hh = String(first.startHour).padStart(2, "0");
//         mainStart = `${hh}:00`;
//       }

//       mainDuration = first.duration || 1;
//     }

//     const [result] = await pool.query(
//       `INSERT INTO bookings
//        (nama, telepon, ruangan, tanggal, jam_mulai, durasi, catatan, subtotal, discount, total, paymentStatus, slots_json)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         nama,
//         telepon,
//         ruangan,
//         Array.isArray(mainDate) ? JSON.stringify(mainDate) : mainDate,
//         mainStart,
//         mainDuration,
//         catatan || "",
//         subtotal || 0,
//         discount || 0,
//         total || 0,
//         paymentStatus || "pending",
//         slots ? JSON.stringify(slots) : null,
//       ]
//     );

//     const newId = result.insertId;

//     return res.json({
//       success: true,
//       bookingId: newId,
//       booking: {
//         id: newId,
//         nama,
//         telepon,
//         ruangan,
//         tanggal: mainDate,
//         jam_mulai: mainStart,
//         durasi: mainDuration,
//         catatan,
//         subtotal,
//         discount,
//         total,
//         paymentStatus: paymentStatus || "pending",
//       },
//     });
//   } catch (err) {
//     console.error("POST /api/bookings error:", err);
//     res.status(500).json({ success: false, message: "Gagal menyimpan booking" });
//   }
// });

app.post("/api/payments/qris", async (req, res) => {
  try {
    const { bookingId, amount, deskripsi } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: "bookingId & amount wajib diisi",
      });
    }

    const token = await getBoobleToken();
    const noRef = `BOOK-${bookingId}`;

    const resp = await fetch(`${process.env.BOOBLE_BASE_URL}/qris/create-qris`, {
      method: "POST",
      headers: {
        publicAccessToken: `Bearer ${token}`,
        "app-key": process.env.BOOBLE_APP_KEY,
        "app-secret": process.env.BOOBLE_APP_SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        no_ref: noRef,
        deskripsi: deskripsi || `Pembayaran Booking #${bookingId}`,
        amount: Number(amount),
        manualCharge: 0,
      }),
    });

    const text = await resp.text();
    console.log("🔍 RAW RESPONSE /qris/create-qris:", resp.status, text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Respon QRIS bukan JSON",
        raw: text,
      });
    }

    if (!resp.ok || !data.status) {
      console.error("❌ Booble error:", data);
      return res.status(500).json({
        success: false,
        message: data.message || "QRIS gagal dibuat",
        raw: data,
      });
    }

    const info = data.data;

    return res.json({
      success: true,
      referenceId: info.referenceId,
      qrData: info.qrData,
      amount: info.amount,
    });
  } catch (e) {
    console.error("❌ /api/payments/qris error:", e);
    res.status(500).json({
      success: false,
      message: e.message || "Server error",
    });
  }
});

app.post("/api/qris/callback", async (req, res) => {
  try {
    console.log("CALLBACK:", req.body);

    const data = req.body.data || {};
    const noRef = data.no_ref;
    const statusFromBooble = data.status; // contoh: "PAID"

    if (!noRef) {
      console.error("Callback tanpa no_ref");
      return res.sendStatus(400);
    }

    const bookingId = noRef.replace("BOOK-", "");

    // Normalisasi status dari Booble
    const normalized = String(statusFromBooble || "").toUpperCase();

    let newStatus = "pending";
    if (normalized === "PAID" || normalized === "COMPLETED") {
      newStatus = "paid";
    } else if (normalized === "EXPIRED") {
      newStatus = "cancelled";
    }

    const [result] = await pool.query("UPDATE bookings SET paymentStatus = ? WHERE id = ?", [newStatus, bookingId]);

    console.log(`UPDATE paymentStatus booking #${bookingId} => ${newStatus} (affectedRows=${result.affectedRows})`);

    return res.sendStatus(200);
  } catch (err) {
    console.error("Error di callback QRIS:", err);
    return res.sendStatus(500);
  }
});

// === Jalankan server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
