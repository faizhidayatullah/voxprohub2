import pool from "../config/db.js";

// GET THEME SETTINGS
export const getTheme = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM theme_settings ORDER BY id DESC LIMIT 1");

    res.json(rows[0] || { theme_color: "light", theme_font: "Inter" });
  } catch (err) {
    console.error("❌ Gagal mengambil data tema:", err);
    res.status(500).json({ error: "Gagal mengambil data tema" });
  }
};

// UPDATE THEME SETTINGS
export const updateTheme = async (req, res) => {
  const { theme_color, theme_font } = req.body;

  if (!theme_color || !theme_font) {
    return res.status(400).json({ error: "Kolom tidak boleh kosong" });
  }

  try {
    await pool.query(
      `
      UPDATE theme_settings 
      SET theme_color = ?, theme_font = ?, updated_at = NOW()
      WHERE id = 1
      `,
      [theme_color, theme_font]
    );

    res.json({ success: true, message: "🎨 Tema berhasil diperbarui!" });
  } catch (err) {
    console.error("❌ Gagal memperbarui tema:", err);
    res.status(500).json({ error: "Gagal memperbarui tema" });
  }
};
