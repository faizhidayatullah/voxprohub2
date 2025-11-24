import pool from "../config/db.js";

// === GET semua user ===
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");

    console.log("✅ Data user berhasil diambil:", rows);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Gagal mengambil data user:", error);
    return res.status(500).json({
      message: "Gagal mengambil data user",
      error: error?.message || error,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus user:", err);
    res.status(500).json({ message: "Gagal menghapus user" });
  }
};
