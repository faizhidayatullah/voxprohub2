import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import image14 from "../assets/image14.png";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Semua kolom wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Pendaftaran berhasil! Silakan login.");
        navigate("/login");
      } else {
        alert(data.message || "Gagal mendaftar");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Left illustration panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 items-center justify-center relative p-8">
          <div className="text-center text-white">
            <img
              src={image14}
              alt="Voxpro Hub Logo"
              className="w-24 h-24 mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold mb-2">Verifikasi Akun</h2>
            <p className="text-sm">
              Pesan ruang untuk meeting, webinar, atau podcast Anda sekarang.
            </p>
          </div>
        </div>

        {/* Right register panel */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Daftar Akun
          </h1>
          <p className="text-gray-500 mb-6">
             Daftar sekarang untuk memesan ruangan di Voxpro Hub dengan mudah
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10 text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10 text-gray-800"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-800"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition"
            >
              Daftar Sekarang
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline font-semibold"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
