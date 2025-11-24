import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import image14 from "../assets/image14.png"; // logo

export default function DetailLayanan() {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const [layanan, setLayanan] = useState([]);
  const [selected, setSelected] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 20);
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/layanan")
      .then((res) => {
        const updated = res.data.map((item) => ({
          ...item,
          imageUrl: item.imageUrl || "/fallback.png",
        }));
        setLayanan(updated);
      })
      .catch((err) => console.error("Gagal mengambil data layanan:", err));

    // Ambil hero image
    axios
      .get("http://localhost:5000/api/settings/hero-image")
      .then((res) => setHeroImage(res.data.image))
      .catch(() => setHeroImage(null));
  }, []);

  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Booking", path: "/booking" },
    { name: "Fasilitas", path: "/fasilitas" },
    { name: "Kontak", path: "/kontak" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden transition-colors duration-500 bg-white text-gray-800 font-[Poppins,Inter,sans-serif]">
      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scroll ? "bg-[#0d1224]/95 shadow-md backdrop-blur-md py-2" : "bg-white/95 py-3"
          } border-b ${scroll ? "border-[#0d1224]/40" : "border-gray-200/30"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={image14} alt="Logo" className="w-10 h-10 rounded-full drop-shadow-md object-cover" />
            <div>
              <h1
                className={`font-extrabold tracking-tight text-lg md:text-xl bg-clip-text text-transparent ${scroll ? "bg-gradient-to-r from-blue-300 to-cyan-300" : "bg-gradient-to-r from-blue-600 to-cyan-400"
                  }`}
              >
                VOXPRO HUB
              </h1>
              <p className={`text-xs -mt-0.5 ${scroll ? "text-gray-200" : "text-gray-500"}`}>
                Creative Voxprohub • Makassar
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex gap-8 items-center font-medium text-sm ${scroll ? "text-gray-200" : "text-gray-700"}`}>
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`relative group px-2 py-1 rounded-md transition-colors ${scroll ? "hover:text-blue-300" : "hover:text-blue-600"
                  }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-0 w-0 h-[2px] rounded transition-all duration-300 ${scroll
                      ? "bg-gradient-to-r from-blue-300 to-cyan-300 group-hover:w-full"
                      : "bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full"
                    }`}
                ></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <svg
              className={`w-6 h-6 transition-colors duration-500 ${scroll ? "text-white" : "text-blue-600"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-64 py-4" : "max-h-0"} ${scroll ? "bg-[#0d1224]/95" : "bg-white/90 backdrop-blur-md"
            }`}
        >
          <div className="flex flex-col items-center gap-3 font-medium text-sm">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={`transition-colors duration-500 ${scroll ? "text-white hover:text-blue-300" : "text-blue-600 hover:text-blue-400"}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* === HERO IMAGE === */}
      {heroImage && (
        <div className="relative w-full h-[480px] md:h-[520px] overflow-hidden mt-16">
          <img
            src={`http://localhost:5000/uploads/${heroImage}`}
            alt="Hero"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white text-center px-4 leading-tight drop-shadow-lg"
            >
              Inspirasi, Kreativitas, dan Kolaborasi
            </motion.h1>
          </div>
        </div>
      )}

      {/* === LAYANAN === */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-5 text-blue-600"
        >
          Layanan Kami
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center text-gray-600 italic mb-12 text-lg md:text-xl font-normal"
        >
          Ruang penuh inspirasi dan fungsi — pilih yang sesuai kebutuhanmu ↓
        </motion.p>

        <div className="flex flex-wrap justify-center gap-6">
          {layanan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelected(item)}
              className="cursor-pointer w-[270px] md:w-[290px] bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-500"
            >
              <div className="relative">
                {/* ✅ gunakan item.imageUrl agar gambar tampil */}
                <img
                src={item.imageUrl || "/fallback.png"}
                alt={item.title}
                className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-700"
              />
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col justify-between h-[250px]">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.title}</h3>
                  <p className="text-base text-gray-700 font-regular line-clamp-4">{item.description}</p>
                </div>
                <div className="mt-3">
                  {item.priceNew && (
                    <div className="flex items-center gap-2 mb-2">
                      {item.priceOld && <span className="line-through text-gray-400 text-sm">{item.priceOld}</span>}
                      <span className="text-green-700 font-semibold">{item.priceNew}</span>
                    </div>
                  )}
                  <button className="text-sm text-blue-600 font-semibold hover:underline">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* === MODAL DETAIL === */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 max-w-lg w-[90%] relative shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>

                {/* ✅ pastikan juga gunakan imageUrl */}
                <img
                  src={item.imageUrl || "/fallback.png"}
                  alt={item.title}
                  className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-700"
                />


                <h2 className="text-2xl font-bold text-blue-600 mb-2">{selected.title}</h2>

                {selected.badge && (
                  <span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {selected.badge}
                  </span>
                )}

                <p className="text-gray-700 text-lg leading-relaxed mb-4">{selected.description}</p>

                {selected.priceNew && (
                  <div className="flex items-center gap-3 mb-3">
                    {selected.priceOld && (
                      <span className="line-through text-gray-400">{selected.priceOld}</span>
                    )}
                    <span className="text-lg font-bold text-green-700">{selected.priceNew}</span>
                    <span className="text-sm text-gray-500">/ sesi</span>
                  </div>
                )}

                {selected.valid && (
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    📅 {selected.valid}
                  </p>
                )}

                <Link
                  to="/booking"
                  className="w-full inline-block px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:scale-[1.01] transition-transform duration-200 text-center font-semibold"
                >
                  Booking Sekarang
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#0d1224] text-gray-300 pt-12 pb-8 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <h2 className="text-2xl font-bold text-white mb-3">Voxpro Hub</h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              Ruang untuk berkreasi, berinovasi, dan berkolaborasi — karena setiap ide layak untuk diwujudkan.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="text-blue-400">📍</span> Kedai Mantao Lt.2, Jl. Toddopuli Raya, Makassar</li>
              <li className="flex items-center gap-2"><span className="text-blue-400">📞</span> +62 813-5666-8121</li>
              <li className="flex items-center gap-2"><span className="text-blue-400">✉️</span> info@voxprohub.com</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Layanan</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Workspace Provider</li>
              <li>Event Space</li>
              <li>Meeting Room</li>
              <li>Startup Incubation</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://instagram.com/voxprohub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition">
                  <FaInstagram /> Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/voxprohub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition">
                  <FaFacebookF /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} <span className="text-white font-semibold">Voxpro Hub</span> — Crafted with voxprohub Makassar
          </p>
        </div>

        {/* Back to Top Button */}
        {showTopBtn && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full shadow-xl hover:scale-[1.03] transition-transform z-50"
            title="Kembali ke atas"
          >
            ↑
          </button>
        )}
      </footer>
    </div>
  );
}
