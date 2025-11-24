import React from "react";
import { useNavigate } from "react-router-dom";

export default function Beranda() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-orange-50 text-gray-800 px-6 relative">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-1/2 -translate-x-1/2 bg-white text-orange-600 px-3 py-1.5 rounded-full shadow hover:bg-orange-100 transition"
      >
        ← Kembali
      </button>

      {/* Konten */}
      <h1 className="text-3xl font-bold text-gray-900">
        Selamat Datang di <span className="text-orange-600">Voxpro Hub</span>
      </h1>
      <p className="mt-4 max-w-2xl text-gray-700">
        <strong>Voxpro Hub</strong> adalah ruang kerja dan kreatif di Makassar
        yang mendukung kolaborasi, inovasi, dan kenyamanan bagi individu maupun bisnis.
      </p>

      {/* Gambar */}
      <img
        src="https://via.placeholder.com/600x300"
        alt="Voxpro Hub"
        className="mt-8 w-full max-w-3xl rounded-2xl shadow-md border border-white"
      />
    </div>
  );
}
