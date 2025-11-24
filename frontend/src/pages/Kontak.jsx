// === Contact.jsx ===
import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaEnvelope, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import image14 from "../assets/image14.png";

export default function Contact() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // === State Form ===
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const WHATSAPP_NUMBER = "6285242008058"; // Ubah sesuai nomor WhatsApp tujuan (tanpa tanda +)

  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Booking", path: "/booking" },
    { name: "Fasilitas", path: "/fasilitas" },
    { name: "Kontak", path: "/kontak" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 20);
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // === Kirim ke WhatsApp ===
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, topic, message } = formData;
    const text = `*Pesan Baru dari Website Voxpro Hub*\n\n👤 *Nama:* ${name}\n📧 *Email:* ${email}\n📝 *Topik:* ${topic}\n💬 *Pesan:* ${message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    alert("Pesan Anda akan diarahkan ke WhatsApp...");
    window.open(url, "_blank");

    setFormData({ name: "", email: "", topic: "", message: "" });
  };

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
            <img
              src={image14}
              alt="Logo"
              className="w-10 h-10 rounded-full drop-shadow-md object-cover"
            />
            <div>
              <h1
                className={`font-extrabold tracking-tight text-lg md:text-xl bg-clip-text text-transparent ${scroll
                    ? "bg-gradient-to-r from-blue-300 to-cyan-300"
                    : "bg-gradient-to-r from-blue-600 to-cyan-400"
                  }`}
              >
                VOXPRO HUB
              </h1>
              <p
                className={`text-xs -mt-0.5 ${scroll ? "text-gray-200" : "text-gray-500"
                  }`}
              >
                Creative Voxprohub • Makassar
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div
            className={`hidden md:flex gap-8 items-center font-medium text-sm ${scroll ? "text-gray-200" : "text-gray-700"
              }`}
          >
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

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <svg
              className={`w-6 h-6 transition-colors duration-500 ${scroll ? "text-white" : "text-blue-600"
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  open
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-64 py-4" : "max-h-0"
            } ${scroll ? "bg-[#0d1224]/95" : "bg-white/90 backdrop-blur-md"}`}
        >
          <div className="flex flex-col items-center gap-3 font-medium text-sm">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={`transition-colors duration-500 ${scroll
                    ? "text-white hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-400"
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* === MAIN CONTACT SECTION === */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-col items-center justify-center px-6 md:px-24 pt-36 pb-20 max-w-7xl w-full mx-auto text-center relative min-h-[calc(100vh-80px)]"
      >
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Kami siap membantu Anda dan menjawab semua pertanyaan terkait layanan kami.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* === Info Kontak === */}
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col justify-between">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Mari Terhubung
            </h2>
            <p className="text-gray-700 mb-6">
              Kami siap membantu menjawab pertanyaan Anda dan memberikan informasi yang Anda butuhkan.
            </p>

            <div className="space-y-3 mb-6 text-gray-700">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <span>voxprohub@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-green-500" />
                <span>+62 852-4200-8058</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500">📍</span>
                <span>Kedai Mantao Lt.2, Jl. Toddopuli Raya</span>
              </div>
            </div>

            <a
              href="https://wa.me/6285242008058"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 justify-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 transform transition"
            >
              <FaWhatsapp /> Hubungi via WhatsApp
            </a>
          </div>

          {/* === Form Kontak === */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Alamat Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
                />
              </div>
              <input
                name="topic"
                type="text"
                placeholder="Topik"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none"
              />
              <textarea
                name="message"
                rows="5"
                placeholder="Pesan"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none resize-none"
              ></textarea>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-5 py-3 rounded-full shadow-md hover:scale-[1.02] transition-transform duration-200"
              >
                Kirim Pesan Anda →
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* === FOOTER === */}
      <footer className="bg-[#0d1224] text-gray-300 pt-12 pb-8 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <h2 className="text-2xl font-bold text-white mb-3">Voxpro Hub</h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              Mewujudkan ruang kerja modern yang mendukung kolaborasi, kreativitas, dan pertumbuhan digital di Makassar.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">📍</span> Kedai Mantao Lt.2, Jl. Toddopuli Raya, Makassar
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">📞</span> +62 813-5666-8121
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">✉️</span> info@voxprohub.com
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Layanan</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Workspace Provider</li>
              <li>Event Space</li>
              <li>Meeting Room</li>
              <li>Startup Incubation</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/voxprohub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-400 transition"
                >
                  <FaInstagram /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/voxprohub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-400 transition"
                >
                  <FaFacebookF /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} <span className="text-white font-semibold">Voxpro Hub</span> — Crafted with ❤️ in Makassar
          </p>
        </div>

        {/* Back to Top */}
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full shadow-xl z-50"
            title="Kembali ke atas"
          >
            ↑
          </motion.button>
        )}
      </footer>
    </div>
  );
}
