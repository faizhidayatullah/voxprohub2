// controllers/layananController.js
import pool from "../config/db.js";

// Ambil semua layanan
export const getAllLayanan = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM layanan ORDER BY id DESC");
    res.json(
      rows.map((item) => ({
        ...item,
        imageUrl: item.image ? `http://localhost:5000/uploads/${item.image}` : null,
      }))
    );
  } catch (err) {
    console.error("❌ getAllLayanan error:", err);
    res.status(500).json({ message: "Gagal mengambil data layanan", error: err });
  }
};

// Ambil layanan by ID
export const getLayananById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM layanan WHERE id = ?", [req.params.id]);

    if (!rows.length) return res.status(404).json({ message: "Layanan tidak ditemukan" });

    const layanan = {
      ...rows[0],
      imageUrl: rows[0].image ? `http://localhost:5000/uploads/${rows[0].image}` : null,
    };

    res.json(layanan);
  } catch (err) {
    console.error("❌ getLayananById error:", err);
    res.status(500).json({ message: "Gagal mengambil layanan", error: err });
  }
};

// Tambah layanan baru
export const createLayanan = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description || !image) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    const filename = image.split("/uploads/")[1];

    const [result] = await pool.query("INSERT INTO layanan (title, description, image) VALUES (?, ?, ?)", [title, description, filename]);

    res.json({
      message: "Layanan berhasil ditambahkan",
      layanan: {
        id: result.insertId,
        title,
        description,
        image: filename,
        imageUrl: `http://localhost:5000/uploads/${filename}`,
      },
    });
  } catch (err) {
    console.error("❌ createLayanan error:", err);
    res.status(500).json({ message: "Gagal menambah layanan", error: err });
  }
};

// Update layanan
export const updateLayanan = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description || !image) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    const filename = image.split("/uploads/")[1];

    await pool.query("UPDATE layanan SET title = ?, description = ?, image = ? WHERE id = ?", [title, description, filename, req.params.id]);

    res.json({
      message: "Layanan berhasil diperbarui",
      layanan: {
        id: req.params.id,
        title,
        description,
        image: filename,
        imageUrl: `http://localhost:5000/uploads/${filename}`,
      },
    });
  } catch (err) {
    console.error("❌ updateLayanan error:", err);
    res.status(500).json({ message: "Gagal memperbarui layanan", error: err });
  }
};

// Hapus layanan
export const deleteLayanan = async (req, res) => {
  try {
    await pool.query("DELETE FROM layanan WHERE id = ?", [req.params.id]);
    res.json({ message: "Layanan berhasil dihapus" });
  } catch (err) {
    console.error("❌ deleteLayanan error:", err);
    res.status(500).json({ message: "Gagal menghapus layanan", error: err });
  }
};
