import pool from "../config/db.js";

// Ambil semua review
export const getAllReviews = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Database error (getAllReviews):", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Tambah review baru
export const createReview = async (req, res) => {
  const { name, role, rating, img, comment } = req.body;

  if (!name || !rating || !comment) return res.status(400).json({ message: "Data tidak lengkap" });

  try {
    await pool.query("INSERT INTO reviews (name, role, rating, img, comment) VALUES (?, ?, ?, ?, ?)", [name, role, rating, img, comment]);

    res.json({ message: "Review berhasil ditambahkan" });
  } catch (err) {
    console.error("❌ Database error (createReview):", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Update review
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { name, role, rating, img, comment } = req.body;

  try {
    await pool.query("UPDATE reviews SET name=?, role=?, rating=?, img=?, comment=? WHERE id=?", [name, role, rating, img, comment, id]);

    res.json({ message: "Review berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Database error (updateReview):", err);
    res.status(500).json({ message: "Database error" });
  }
};

// Hapus review
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM reviews WHERE id=?", [id]);
    res.json({ message: "Review berhasil dihapus" });
  } catch (err) {
    console.error("❌ Database error (deleteReview):", err);
    res.status(500).json({ message: "Database error" });
  }
};
