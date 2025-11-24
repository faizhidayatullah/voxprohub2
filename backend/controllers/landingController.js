// controllers/landingController.js
import pool from "../config/db.js";

// ✅ Ambil semua konten
export const getAllLandingContent = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM landing_content");
    res.json(rows);
  } catch (err) {
    console.error("❌ Database error (getAllLandingContent):", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Ambil 1 section
export const getLandingSection = async (req, res) => {
  const { section } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM landing_content WHERE section = ?", [section]);

    if (rows.length === 0) return res.status(404).json({ message: "Section not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Database error (getLandingSection):", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Update section
export const updateLandingSection = async (req, res) => {
  const { section } = req.params;
  const { title, subtitle, image, button_text, button_link, font } = req.body;

  try {
    await pool.query(
      `UPDATE landing_content 
       SET title=?, subtitle=?, image=?, button_text=?, button_link=?, font=? 
       WHERE section=?`,
      [title, subtitle, image, button_text, button_link, font, section]
    );

    res.json({ message: "Section updated successfully" });
  } catch (err) {
    console.error("❌ Database error (updateLandingSection):", err);
    res.status(500).json({ message: "Database error" });
  }
};
