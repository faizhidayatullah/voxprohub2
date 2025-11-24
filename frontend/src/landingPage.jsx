// === LandingPage.jsx ===
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaStar } from "react-icons/fa";

// === ASET ===
import image13 from "./assets/image13.png";
import image14 from "./assets/image14.png";
import fasilitas1 from "./assets/fasilitas1.png";
import fasilitas2 from "./assets/fasilitas2.png";
import fasilitas3 from "./assets/fasilitas3.png";

const LazyImage = ({ src, alt, className }) => <img loading="lazy" src={src} alt={alt} className={className} />;

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [hero, setHero] = useState({});
  const [visi, setVisi] = useState({});
  const [fasilitas, setFasilitas] = useState({});
  const [lokasi, setLokasi] = useState({});
  const [kontak, setKontak] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [reviews, setReviews] = useState([]);

  const berandaRef = useRef(null);
  const fasilitasRef = useRef(null);
  const lokasiRef = useRef(null);
  const kontakRef = useRef(null);
  const reviewsRef = useRef(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const fasilitasData = [
    { img: fasilitas1, title: "Podcast Room", desc: "Cocok untuk podcast, video, atau live streaming profesional kapasitas 2-3 orang." },
    { img: fasilitas2, title: "Meeting Room", desc: "Ideal untuk meeting skala kecil dengan fasilitas lengkap kapasitas 6-10 orang." },
    { img: fasilitas3, title: "Small Room", desc: "Nyaman untuk rapat privat atau kerja mandiri kapasitas 2-3 orang." },
  ];

  // Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 20);
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🆕 Ambil data user dari localStorage saat pertama kali load
  useEffect(() => {
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    if (name) setUserName(name);
    if (role) setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil konten landing page
        const landingRes = await axios.get("http://localhost:5000/api/landing");
        const data = landingRes.data;
        setHero(data.find((i) => i.section === "hero") || {});
        setVisi(data.find((i) => i.section === "visi") || {});
        setFasilitas(data.find((i) => i.section === "fasilitas") || {});
        setLokasi(data.find((i) => i.section === "lokasi") || {});
        setKontak(data.find((i) => i.section === "kontak") || {});

        // Ambil review
        const reviewsRes = await axios.get("http://localhost:5000/api/reviews");
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };

    fetchData();
  }, []);

  // Auto Slide
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fasilitasData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoSlide]);

  const scrollToSection = (ref) => {
    setOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 🆕 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    setUserName(null);
    setUserRole(null);

    navigate("/login");
  };

  const handleCardClick = (index) => setCurrentIndex(index);

  // WhatsApp settings
  const WHATSAPP_NUMBER = "6285242008058";
  const WHATSAPP_TEXT = "Halo, saya mau menanyakan tentang layanan dan reservasi.";

  return (
    <div className="min-h-screen overflow-x-hidden transition-colors duration-500 bg-white text-gray-800 font-[Poppins,Inter,sans-serif]">
      {/* === NAVBAR === */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scroll ? "bg-[#0d1224]/95 shadow-md backdrop-blur-md py-2" : "bg-white/95 py-3"} border-b ${scroll ? "border-[#0d1224]/40" : "border-gray-200/30"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={image14} alt="Logo" className="w-10 h-10 rounded-full drop-shadow-md object-cover" />
            <div>
              <h1 className={`font-extrabold tracking-tight text-lg md:text-xl bg-clip-text text-transparent ${scroll ? "bg-gradient-to-r from-blue-300 to-cyan-300" : "bg-gradient-to-r from-blue-600 to-cyan-400"}`}>VOXPRO HUB</h1>
              <p className={`text-xs -mt-0.5 ${scroll ? "text-gray-200" : "text-gray-500"}`}>Creative Voxprohub • Makassar</p>
            </div>
          </div>

          {/* === Desktop Menu === */}
          <div className={`hidden md:flex gap-8 items-center font-medium text-sm ${scroll ? "text-gray-200" : "text-gray-700"}`}>
            {["Beranda", "Fasilitas", "Review", "Lokasi", "Kontak"].map((menu, i) => (
              <button
                key={i}
                onClick={() => scrollToSection([berandaRef, fasilitasRef, reviewsRef, lokasiRef, kontakRef][i])}
                className={`relative group px-2 py-1 rounded-md transition-colors ${scroll ? "hover:text-blue-300" : "hover:text-blue-600"}`}
              >
                {menu}
                <span
                  className={`absolute left-0 bottom-0 w-0 h-[2px] rounded transition-all duration-300 ${
                    scroll ? "bg-gradient-to-r from-blue-300 to-cyan-300 group-hover:w-full" : "bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full"
                  }`}
                ></span>
              </button>
            ))}

            {/* Tombol / Info User */}
            {userName ? (
              // === SUDAH LOGIN ===
              <div className="flex items-center gap-4 ml-6">
                {/* Info user */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold shadow-sm">{userName.charAt(0).toUpperCase()}</div>
                  <div className="flex flex-col leading-tight">
                    <span className={`text-[11px] ${scroll ? "text-gray-300" : "text-gray-500"}`}>Masuk sebagai</span>
                    <span className={`text-sm font-semibold ${scroll ? "text-white" : "text-gray-800"}`}>{userName}</span>
                  </div>
                </div>

                {/* Kalau admin, kasih tombol Dashboard */}
                {userRole === "admin" && (
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className={`px-4 py-2 text-xs md:text-sm rounded-full border transition-all duration-200
                      ${scroll ? "border-blue-300 text-blue-400 hover:bg-blue-700/50" : "border-blue-300 text-blue-700 hover:bg-blue-800/40"}
                    `}
                  >
                    Dashboard
                  </button>
                )}

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 text-sm rounded-full border transition-all duration-200
                    ${scroll ? "border-red-400 text-red-500 hover:bg-red-600/60 hover:border-red-500" : "border-red-300 text-red-600 hover:bg-red-600/60 hover:text-white hover:border-red-400"}
                  `}
                >
                  Logout
                </button>
              </div>
            ) : (
              // === BELUM LOGIN ===
              <div className="flex gap-3 ml-6">
                <Link to="/login" className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${scroll ? "border-blue-300 text-blue-200 hover:bg-blue-800/30" : "border-blue-200 text-blue-600 hover:bg-blue-50"}`}>
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 text-sm rounded-full shadow-md transition-transform duration-200 ${
                    scroll ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-[1.01]" : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-[1.01]"
                  }`}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button className={`transition-transform duration-300 hover:scale-110 ${scroll ? "text-blue-200" : "text-blue-600"}`} onClick={() => setOpen(!open)} aria-label="Open menu">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-80 py-4" : "max-h-0"} ${scroll ? "bg-[#0d1224]/95" : "bg-white/95"} backdrop-blur-md`}>
          <div className={`flex flex-col items-center gap-4 font-medium text-sm ${scroll ? "text-gray-200" : "text-gray-700"}`}>
            {["Beranda", "Fasilitas", "Review", "Lokasi", "Kontak"].map((menu, i) => (
              <button
                key={i}
                onClick={() => scrollToSection([berandaRef, fasilitasRef, reviewsRef, lokasiRef, kontakRef][i])}
                className={`w-full text-left px-6 py-2 transition-colors ${scroll ? "hover:text-blue-300" : "hover:text-blue-600"}`}
              >
                {menu}
              </button>
            ))}
            {userName ? (
              // === MOBILE: SUDAH LOGIN ===
              <div className="flex flex-col items-center gap-3 mt-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold shadow-sm">{userName.charAt(0).toUpperCase()}</div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Masuk sebagai</span>
                    <span className="text-sm font-semibold">{userName}</span>
                  </div>
                </div>

                {userRole === "admin" && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin-dashboard");
                    }}
                    className="w-[70%] px-5 py-1.5 rounded-full border border-blue-300 text-blue-200 hover:bg-blue-800/40 text-sm"
                  >
                    Dashboard Admin
                  </button>
                )}

                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-[70%] px-5 py-1.5 rounded-full border border-red-300 text-red-200 hover:bg-red-600/60 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              // === MOBILE: BELUM LOGIN ===
              <div className="flex gap-3 mt-2">
                <Link to="/login" className={`px-5 py-1.5 rounded-full border transition ${scroll ? "border-blue-300 text-blue-200 hover:bg-blue-800/30" : "border-blue-600 text-blue-600 hover:bg-blue-50"}`}>
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className={`px-5 py-1.5 rounded-full transition ${scroll ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-md" : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-md"}`}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section ref={berandaRef} className="relative pt-28 md:pt-32 pb-16 md:pb-24 bg-[#0d1224] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 items-center">
          {/* Text Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="space-y-6 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{hero.title || ""}</h1>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">{hero.subtitle || "."}</p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              {hero.button_text && (
                <Link
                  to={hero.button_link || "/booking"}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-[1.01] transition transform duration-200"
                >
                  {hero.button_text}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              <button onClick={() => scrollToSection(fasilitasRef)} className="px-6 py-3 border border-blue-400 text-blue-200 rounded-2xl font-semibold hover:bg-blue-800/30 transition">
                Lihat Fasilitas
              </button>
            </div>

            {/* small trust badges */}
            <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white shadow-sm">★</span>
                <div>
                  <div className="text-sm font-semibold text-white">Dipercaya</div>
                  <div className="text-xs text-gray-300">oleh komunitas kreatif Makassar</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-700 text-white shadow-sm">⚡</span>
                <div>
                  <div className="text-sm font-semibold text-white">Siap Pakai</div>
                  <div className="text-xs text-gray-300">ruangan lengkap & modern</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Right */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <img src={image13} alt="Team" className="w-full h-full object-cover" style={{ minHeight: 380 }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* === VISI SECTION === */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{visi?.title || "Visi & Misi"}</h2>
          <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg leading-relaxed">{visi?.subtitle || "Menjadi pusat kreatif terdepan yang menghubungkan talenta digital, kreator, dan pelaku bisnis melalui ruang kerja dan pengalaman kolaboratif."}</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[
            { icon: "🏢", title: "Ruang Kerja Modern", desc: "Tempat nyaman & representatif di pusat Kota Makassar." },
            { icon: "🎙️", title: "Studio Podcast Profesional", desc: "Dilengkapi alat rekaman dan teknisi onsite siap bantu." },
            { icon: "💼", title: "Meeting Room Fleksibel", desc: "Cocok untuk meeting, kelas privat, atau pelatihan kecil." },
            { icon: "☕", title: "Kedai Mantao di Lantai 1", desc: "Nikmati kopi & suasana santai untuk mendukung produktivitas." },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3 text-blue-600">{item.icon}</div>
              <div className="flex flex-wrap justify-center gap-x-2 text-gray-700 text-sm leading-snug max-w-[220px]">
                <span className="font-semibold text-gray-900">{item.title}</span>
                <span>{item.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === FASILITAS === */}
      <section ref={fasilitasRef} className="bg-white py-16 md:py-24 px-6 md:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {fasilitas.title || "Fasilitas Kami"} {/* Dinamis dari API */}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {fasilitas.subtitle || "Pilih ruang sesuai kebutuhanmu — dari studio profesional, ruang meeting, hingga ruang privat."} {/* Dinamis dari API */}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {(
            fasilitas.items || [
              {
                img: fasilitas1,
                title: "Podcast Room",
                desc: "Cocok untuk podcast, video, atau live streaming profesional kapasitas 2-3 orang.",
                priceOld: "Rp350.000",
                priceNew: "Rp250.000",
                badge: "Penawaran Spesial",
                valid: "Berlaku hingga 31 Des 2025",
                btn: "Reservasi Sekarang",
              },
              {
                img: fasilitas2,
                title: "Meeting Room",
                desc: "Ideal untuk meeting skala kecil dengan fasilitas lengkap kapasitas 6-10 orang.",
                priceOld: "Rp300.000",
                priceNew: "Rp220.000",
                badge: "Nilai Terbaik",
                valid: "Bisa dipesan kapan saja",
                btn: "Pesan Hari Ini",
              },
              {
                img: fasilitas3,
                title: "Small Room",
                desc: "Nyaman untuk rapat privat atau kerja mandiri kapasitas 2-3 orang.",
                priceOld: "Rp200.000",
                priceNew: "Rp150.000",
                badge: "Promo Awal",
                valid: "Pesan lebih awal & hemat",
                btn: "Booking Awal",
              },
            ]
          ).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              {/* Gambar + Badge */}
              <div className="relative">
                <img src={item.img} alt={item.title} className="w-full h-[220px] object-cover" />
                {item.badge && <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">{item.badge}</div>}
              </div>

              {/* Isi Card */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>

                {/* Harga */}
                {item.priceOld && item.priceNew && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="line-through text-gray-400 text-sm">{item.priceOld}</span>
                    <span className="text-lg font-bold text-green-700">{item.priceNew}</span>
                    <span className="text-sm text-gray-500">/ sesi</span>
                  </div>
                )}

                {/* Validitas */}
                {item.valid && <div className="flex items-center text-xs text-gray-500 mb-4">📅 {item.valid}</div>}

                {/* Tombol */}
                <Link to="/booking" className="w-full px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:scale-[1.01] transition-transform duration-200 mb-3 inline-block text-center">
                  {item.btn}
                </Link>

                {/* View details */}
                <div className="text-right">
                  <Link to="/detail-layanan" className="text-blue-600 text-sm font-semibold hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === REVIEW & RATING === */}
      <section
        ref={reviewsRef}
        className="bg-white py-20 px-6 md:px-16 scroll-mt-24" // ← tambahkan scroll-mt agar tidak ketutup navbar
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Apa Kata Mereka</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Testimoni nyata dari pelanggan yang telah menggunakan fasilitas kami di Voxpro Hub Makassar.</p>
          <div className="mx-auto mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto pr-2">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, j) => (
                  <FaStar key={j} className={`w-5 h-5 ${j < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>

              <p className="text-gray-700 italic mb-6 leading-relaxed">“{review.comment}”</p>

              <div className="flex items-center gap-4 mt-auto">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" />
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === LOKASI === */}
      <section ref={lokasiRef} className="relative bg-white py-16 md:py-20 px-6 md:px-20">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-full h-[380px] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <iframe title="Lokasi Voxpro Hub" src="https://www.google.com/maps?q=Kedai%20Mantao%20Makassar&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="rounded-3xl"></iframe>
          </motion.div>

          <motion.div initial={{ x: 40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{lokasi?.title || "Lokasi Kami"}</h2>

            <p className="text-gray-600 text-lg leading-relaxed">{lokasi?.subtitle || "Temukan kami di pusat kota Makassar — mudah diakses dan dekat dengan berbagai fasilitas publik."}</p>

            {lokasi?.button_link && (
              <a
                href={lokasi.button_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-md hover:scale-[1.01] transition-transform duration-200"
              >
                Buka di Google Maps
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* === KONTAK === */}
      <section ref={kontakRef} className="relative bg-white text-gray-800 py-16 md:py-20 px-6 md:px-20">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{kontak.title || "Kontak Kami"}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{kontak.subtitle || "Butuh bantuan? Hubungi kami via email atau WhatsApp."}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Info Kontak */}
            <motion.div initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800">Mari Terhubung</h3>
              <p className="text-gray-600 leading-relaxed">Kami siap membantu menjawab pertanyaan Anda dan memberikan informasi yang Anda butuhkan.</p>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-center gap-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" className="w-5 h-5 opacity-80" />
                  <span>{kontak.email || "contact@example.com"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/159/159832.png" alt="Phone" className="w-5 h-5 opacity-80" />
                  <span>{kontak.phone || "+62 852-4200-8058"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Location" className="w-5 h-5 opacity-80" />
                  <span>{kontak.address || "Kedai Mantao Lt.2, Jl. Toddopuli Raya"}</span>
                </div>
              </div>

              {kontak.button_text && (
                <a
                  href={kontak.button_link || `https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-4 py-2 rounded-full shadow-md hover:scale-[1.01] transition-transform duration-200"
                >
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WA" className="w-4 h-4" />
                  {kontak.button_text}
                </a>
              )}
            </motion.div>

            {/* Form Kontak */}
            <motion.div initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();

                  const fullName = e.target.fullName.value;
                  const email = e.target.email.value;
                  const subject = e.target.subject.value;
                  const message = e.target.message.value;

                  // === Format pesan ke WhatsApp ===
                  const whatsappNumber = WHATSAPP_NUMBER; // ubah ke nomor tujuan (tanpa +)
                  const text = `*Pesan Baru dari Website Voxpro Hub*\n\n👤 *Nama:* ${fullName}\n📧 *Email:* ${email}\n📝 *Subjek:* ${subject}\n💬 *Pesan:* ${message}`;
                  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

                  window.open(url, "_blank"); // buka WhatsApp
                }}
              >
                <div className="grid md:grid-cols-2 gap-3">
                  <input name="fullName" type="text" placeholder="Nama Lengkap" required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none" />
                  <input name="email" type="email" placeholder="Alamat Email" required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none" />
                </div>
                <input name="subject" type="text" placeholder="Topik" required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none" />
                <textarea name="message" rows="5" placeholder="Pesan" required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-200 outline-none resize-none"></textarea>
                <button type="submit" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium px-4 py-2 rounded-full shadow-md hover:scale-[1.01] transition-transform duration-200">
                  Kirim Pesan Anda →
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#0d1224] text-gray-300 pt-12 pb-8 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <h2 className="text-2xl font-bold text-white mb-3">Voxpro Hub</h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">Mewujudkan ruang kerja modern yang mendukung kolaborasi, kreativitas, dan pertumbuhan digital di Makassar.</p>
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

          {/* Studio Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Studio</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => scrollToSection(berandaRef)} className="hover:text-blue-400 transition">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(fasilitasRef)} className="hover:text-blue-400 transition">
                  Fasilitas
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(reviewsRef)} className="hover:text-blue-400 transition">
                  Review
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(lokasiRef)} className="hover:text-blue-400 transition">
                  Lokasi
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(kontakRef)} className="hover:text-blue-400 transition">
                  Kontak
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
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

        {/* Divider */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} <span className="text-white font-semibold">Voxpro Hub</span> — Crafted with voxprohub Makassar
          </p>
        </div>

        {/* Back to Top */}
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

      {/* =========================
          Floating WhatsApp Button
          ========================= */}
      <div aria-hidden={false} className="fixed z-50 bottom-6 right-20 md:right-24 flex items-center gap-3">
        {/* Small circular icon for mobile (only shows on small screens) */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat via WhatsApp"
          className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:scale-105 transition-transform"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>

        {/* Full bubble with text for md+ screens */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi Kami - Chat WhatsApp"
          className="hidden md:flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 shadow-xl hover:scale-[1.02] transition-transform"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
            <FaWhatsapp className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold leading-none">Hubungi Kami Disini</div>
            <div className="text-xs opacity-90">Chat WhatsApp</div>
          </div>
        </a>
      </div>
    </div>
  );
}
