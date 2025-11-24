import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import image14 from "../assets/image14.png";
import googleLogo from "../assets/google-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "voxprohub@gmail.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      alert("Login berhasil sebagai Admin!");
      localStorage.setItem("role", "admin");
      localStorage.setItem("name", "Administrator");
      navigate("/admin-dashboard");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const userRole = data.role || "user";
        alert(`Login berhasil sebagai ${userRole}!`);

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("name", data.name);

        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }
      } else {
        alert(data.message || "Login gagal!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server!");
    }
  };

  const handleGoogleSignIn = () => {
    alert("Login dengan Google berhasil (simulasi)!");
    localStorage.setItem("role", "user");
    navigate("/home");
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
            <p className="text-sm">Pesan ruang untuk meeting, webinar, atau podcast Anda sekarang.</p>
          </div>
        </div>

        {/* Right login panel */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Halo!</h1>
          <p className="text-gray-500 mb-6">Selamat datang kembali di Voxpro Hub..</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <input type="checkbox" className="w-4 h-4" /> Simpan Login
              </label>
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => alert("Fitur lupa password belum tersedia")}
              >
                Lupa Sandi?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition"
            >
              Login
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">atau</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
          >
            <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Sign In dengan Google</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline font-semibold"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
