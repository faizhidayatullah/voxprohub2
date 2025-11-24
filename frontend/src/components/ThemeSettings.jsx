// === ThemeSettings.jsx ===
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ThemeSettings() {
  const [theme, setTheme] = useState("orange");
  const [font, setFont] = useState("Inter");

  // 🔹 Ambil pengaturan tema dari DB saat pertama kali load
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/theme")
      .then((res) => {
        if (res.data) {
          setTheme(res.data.theme_color || "orange");
          setFont(res.data.theme_font || "Inter");
          applyTheme(res.data.theme_color, res.data.theme_font);
        }
      })
      .catch((err) => console.error("❌ Gagal memuat tema:", err));
  }, []);

  // 🔹 Terapkan tema ke body
  const applyTheme = (color, fontFamily) => {
    document.body.style.transition = "background 0.3s ease, color 0.3s ease";
    document.body.style.fontFamily = fontFamily;

    if (color === "dark") {
      document.body.style.background = "#111827";
      document.body.style.color = "#f3f4f6";
    } else if (color === "light") {
      document.body.style.background = "#f9fafb";
      document.body.style.color = "#111";
    } else {
      // orange / warm default
      document.body.style.background =
        "linear-gradient(to bottom right, #fff7ed, #ffedd5)";
      document.body.style.color = "#1f2937";
    }
  };

  // 🔹 Simpan ke database
  const handleSave = async () => {
    try {
      await axios.put("http://localhost:5000/api/theme", {
        theme_color: theme,
        theme_font: font,
      });
      applyTheme(theme, font);
      alert("✅ Tema berhasil disimpan!");
    } catch (error) {
      console.error("❌ Gagal menyimpan tema:", error);
      alert("❌ Gagal update tema.");
    }
  };

  return (
    <div className="p-5 rounded-xl border bg-white shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">🎨 Pengaturan Tema</h2>

      <label className="block text-sm mb-2">Mode Warna:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="orange">🟠 Orange (Default)</option>
        <option value="light">🌤️ Terang</option>
        <option value="dark">🌙 Gelap</option>
      </select>

      <label className="block text-sm mb-2">Font:</label>
      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="Inter">Inter</option>
        <option value="Poppins">Poppins</option>
        <option value="Roboto">Roboto</option>
        <option value="Open Sans">Open Sans</option>
        <option value="Montserrat">Montserrat</option>
      </select>

      <button
        onClick={handleSave}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white w-full py-2 rounded-lg hover:shadow-lg transition"
      >
        Simpan Tema
      </button>
    </div>
  );
}
