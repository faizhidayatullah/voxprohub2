import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

import podcastRoom from "../assets/podcast-room.png";
import creativeStudio from "../assets/creative-studio.png";
import smallRoom from "../assets/small-room.png";
import meetingRoom from "../assets/meeting-room.png";
import loungeArea from "../assets/lounge-area.png";
import image14 from "../assets/image14.png";

export default function DetailLayanan() {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
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

  const layanan = [
    {
      id: 1,
      title: "Podcast Room",
      desc: "Ruang kedap suara eksklusif dengan mikrofon profesional, mixer, dan pencahayaan lembut. Cocok untuk konten kreator, podcaster, dan musisi yang ingin kualitas audio maksimal.",
      image: podcastRoom,
      fasilitas: ["AC", "TV 55 inch", "Wi-Fi kencang", "Mikrofon profesional", "Mixer audio"],
      kapasitas: "1-4 orang",
      lokasi: "Lantai 2, dekat lobby utama",
      diskon: "20% untuk pemesanan 3 jam pertama",
      harga: "Rp 150.000 / jam",
    },
    {
      id: 2,
      title: "Creative Studio",
      desc: "Studio kreatif dengan backdrop premium, pencahayaan adjustable, dan area kerja fleksibel. Ideal untuk photoshoot, video produksi, dan brainstorming kreatif.",
      image: creativeStudio,
      fasilitas: ["AC", "Backdrop premium", "Lampu LED adjustable", "Wi-Fi cepat", "Meja kerja modular"],
      kapasitas: "1-6 orang",
      lokasi: "Lantai 3, dekat ruang meeting",
      diskon: "15% untuk pemesanan 2 jam pertama",
      harga: "Rp 200.000 / jam",
    },
    {
      id: 3,
      title: "Lounge Area",
      desc: "Tempat istirahat bergaya modern dengan aroma kopi hangat dan desain estetis. Diciptakan untuk kolaborasi santai, diskusi ringan, atau inspirasi santai.",
      image: loungeArea,
      fasilitas: ["AC", "Sofa nyaman", "Wi-Fi kencang", "Meja kopi", "Tanaman hias"],
      kapasitas: "1-8 orang",
      lokasi: "Lantai 1, dekat pantry",
      diskon: "Gratis minuman untuk 2 jam pertama",
      harga: "Rp 100.000 / jam",
    },
    {
      id: 4,
      title: "Small Room",
      desc: "Ruang privat kecil dan tenang, cocok untuk bekerja fokus, meeting singkat, atau private call. Nyaman dengan pencahayaan hangat.",
      image: smallRoom,
      fasilitas: ["AC", "Meja & kursi ergonomis", "Wi-Fi stabil", "Lampu meja"],
      kapasitas: "1-2 orang",
      lokasi: "Lantai 2, dekat tangga belakang",
      diskon: "10% untuk pemesanan 2 jam pertama",
      harga: "Rp 80.000 / jam",
    },
    {
      id: 5,
      title: "Meeting Room",
      desc: "Ruang rapat modern dengan tata ruang elegan, proyektor, dan konektivitas lancar. Tempat terbaik untuk merancang strategi dan mengambil keputusan.",
      image: meetingRoom,
      fasilitas: ["AC", "Proyektor & layar", "Wi-Fi cepat", "Whiteboard", "Meja rapat kapasitas 8-12 orang"],
      kapasitas: "1-12 orang",
      lokasi: "Lantai 3, dekat elevator",
      diskon: "20% untuk pemesanan setengah hari",
      harga: "Rp 250.000 / jam",
    },
  ];

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

      {/* === HERO === */}
      <section className="relative h-[480px] md:h-[560px] w-full overflow-hidden mt-16">
        <img src={podcastRoom} alt="Hero Background" className="object-cover w-full h-full brightness-90" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20 px-4">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-bold tracking-wide drop-shadow-lg leading-tight">
            Inspirasi, Kreativitas, dan Kolaborasi
          </motion.h1>
          <p className="mt-5 text-lg md:text-xl max-w-2xl text-gray-200 font-medium">
            Temukan ruang yang dirancang untuk mendukung setiap ide besar dan proses kreatifmu.
          </p>
        </div>
      </section>

      {/* === SHOWCASE === */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto relative">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} className="text-center text-gray-600 italic mb-12 text-sm">
          Ruang penuh inspirasi dan fungsi — klik untuk melihat detail layanan ↓
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-5 relative">
          {layanan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
              className="w-[260px] md:w-[280px] bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-500 hover:bg-[#e8f0ff]"
              onClick={() => setSelected(item)}
            >
              <div className="relative">
                <img src={item.image} alt={item.title} className="w-full h-[280px] object-cover transition-transform duration-700 hover:scale-110" />
                {item.diskon && (
                  <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
                    {item.diskon.split(" ")[0]} OFF
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{item.desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.fasilitas.map((f, i) => (
                    <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          <div className="hidden md:block absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white/0 to-white/50 pointer-events-none"></div>
          <div className="hidden md:block absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white/0 to-white/50 pointer-events-none"></div>
        </div>

        {/* === MODAL DETAIL === */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-lg w-[90%] shadow-2xl relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setSelected(null)} className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl">✕</button>
                <img src={selected.image} alt={selected.title} className="w-full h-64 object-cover rounded-xl mb-4" />
                <h2 className="text-2xl font-bold text-blue-600 mb-2">{selected.title}</h2>
                <p className="text-gray-700 mb-3">{selected.desc}</p>
                <ul className="text-gray-600 mb-3 list-disc list-inside">
                  {selected.fasilitas.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mb-1"><strong>Kapasitas:</strong> {selected.kapasitas}</p>
                <p className="text-gray-700 mb-1"><strong>Lokasi:</strong> {selected.lokasi}</p>
                {selected.diskon && <p className="text-green-600 mb-1"><strong>Diskon:</strong> {selected.diskon}</p>}
                <p className="text-blue-600 font-semibold mb-4">{selected.harga}</p>
                <Link
                  to="/booking"
                  className="block text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform duration-200"
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
              Mewujudkan ruang kerja modern yang mendukung kolaborasi, kreativitas, dan pertumbuhan digital di Makassar.
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
        {showTopBtn && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-xl hover:scale-105 transition-transform duration-200 z-50"
          >
            ↑
          </button>
        )}
      </footer>
    </div>
  );
}
