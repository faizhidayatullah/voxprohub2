// === AdminDashboard.jsx ===
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image14 from "../assets/image14.png";
import { FaEdit, FaTrash, FaSignOutAlt, FaPlus, FaCog, FaChartBar, FaClipboardList, FaUsers, FaSave, FaEye, FaImage, FaTachometerAlt, FaCalendarCheck, FaUserFriends, FaBoxes, FaLayerGroup, FaPalette } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // === API ENDPOINTS ===
  const API_BASE = "http://localhost:5000";
  const API_URL_BOOKING = `${API_BASE}/api/bookings`;
  const API_URL_LANDING = `${API_BASE}/api/landing`;
  const API_URL_THEME = `${API_BASE}/api/theme`;
  const API_URL_USERS = `${API_BASE}/api/users`;
  const API_URL_LAYANAN = `${API_BASE}/api/layanan`;
  const API_URL_LAYANAN_UPLOAD = `${API_BASE}/api/layanan/upload`;
  const API_URL_REVIEWS = `${API_BASE}/api/reviews`;

  // === STATE UTAMA ===
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    telepon: "",
    ruangan: "",
    tanggal: "",
    jam_mulai: "",
    durasi: 1,
    detail: "",
    catatan: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboardoverview");
  const [content, setContent] = useState([]);
  const [editing, setEditing] = useState(null);
  const [landingForm, setLandingForm] = useState({});
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [themeSettings, setThemeSettings] = useState({
    theme_color: "dark",
    theme_font: "Inter",
  });

  // ===========================
  // === REVIEW HANDLERS =======
  // ===========================
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    role: "",
    rating: 5,
    img: "",
    comment: "",
  });

  // === PASTIKAN FETCH REVIEWS SAAT TAB LANDING AKTIF ===
  useEffect(() => {
    if (activeTab === "landing") {
      fetchReviews();
    }
  }, [activeTab]);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(API_URL_REVIEWS);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchReviews:", err);
    }
  };

  // Edit review
  const handleEditReview = (r) => {
    setEditingReviewId(r.id || r._id);
    setReviewForm({ ...r });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save review
  const handleSaveReview = async () => {
    if (!editingReviewId) return;
    try {
      await axios.put(`${API_URL_REVIEWS}/${editingReviewId}`, reviewForm);
      alert("✅ Review berhasil diperbarui!");
      setEditingReviewId(null);
      await fetchReviews();
    } catch (err) {
      console.error("handleSaveReview:", err);
      alert("❌ Gagal menyimpan review.");
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Yakin ingin menghapus review ini?")) return;
    try {
      await axios.delete(`${API_URL_REVIEWS}/${id}`);
      await fetchReviews();
      alert("✅ Review dihapus!");
    } catch (err) {
      console.error("handleDeleteReview:", err);
      alert("❌ Gagal menghapus review.");
    }
  };

  // Handle form change
  const handleChangeReviewForm = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  // === LAYANAN ===
  const [layanan, setLayanan] = useState([]);
  const [formLayanan, setFormLayanan] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
  });
  const [editLayananMode, setEditLayananMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEditLayananModal, setShowEditLayananModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const colors = {
    // === DARK THEME ===
    dark: {
      bgMain: "bg-gray-950",
      textMain: "text-gray-100",
      sidebarBg: "bg-gray-900/90 backdrop-blur-md",
      sidebarText: "text-gray-100",
      cardBg: "bg-gray-900/80 backdrop-blur-md shadow-lg",
      cardBorder: "border-gray-800",
      hoverBg: "hover:bg-gray-800/80",
      buttonPrimary: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg",
      buttonDanger: "bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg",
      buttonGradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 text-white font-medium shadow-md",
      tableHeader: "bg-gray-800 text-gray-100 font-semibold",
      inputBg: "bg-gray-800/70 focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all",
    },

    // === LIGHT THEME ===
    light: {
      bgMain: "bg-gray-100",
      textMain: "text-gray-800",
      sidebarBg: "bg-white/90 backdrop-blur-md",
      sidebarText: "text-gray-800",
      cardBg: "bg-white shadow-md backdrop-blur-md",
      cardBorder: "border-gray-300",
      hoverBg: "hover:bg-gray-200",
      buttonPrimary: "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md",
      buttonDanger: "bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 hover:from-red-600 hover:to-rose-600 text-white shadow-md",
      buttonGradient: "bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 hover:from-sky-500 hover:to-indigo-500 text-white font-medium shadow",
      tableHeader: "bg-gray-200 text-gray-800 font-semibold",
      inputBg: "bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all",
    },

    // === ORANGE / DEFAULT THEME ===
    orange: {
      bgMain: "bg-gradient-to-br from-white via-orange-50 to-orange-100",
      textMain: "text-gray-800",
      sidebarBg: "bg-gradient-to-b from-white via-orange-50 to-orange-100 backdrop-blur-md",
      sidebarText: "text-gray-800",
      cardBg: "bg-white/90 backdrop-blur-md shadow-md",
      cardBorder: "border-orange-200",
      hoverBg: "hover:bg-orange-100/70",
      buttonPrimary: "bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white shadow-md",
      buttonDanger: "bg-gradient-to-r from-red-400 via-red-500 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white shadow-md",
      buttonGradient: "bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 hover:from-orange-400 hover:to-amber-400 text-gray-900 font-semibold shadow",
      tableHeader: "bg-orange-100 text-gray-800 font-semibold",
      inputBg: "bg-orange-50 focus:bg-white focus:ring-2 focus:ring-orange-300 transition-all",
    },
  };

  const currentColor = colors[themeSettings.theme_color] || colors.orange;

  // === THEME LOCALSTORAGE ===
  useEffect(() => {
    const storedTheme = localStorage.getItem("themeSettings");
    if (storedTheme) {
      try {
        setThemeSettings(JSON.parse(storedTheme));
      } catch {
        // Jika parsing gagal, gunakan fallback ke dark
        setThemeSettings({ theme_color: "dark", theme_font: "Inter" });
      }
    } else {
      // Jika belum ada data tersimpan, set default dark mode
      setThemeSettings({ theme_color: "dark", theme_font: "Inter" });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
  }, [themeSettings]);

  // === FETCH DATA WHEN TAB CHANGES ===
  useEffect(() => {
    if (activeTab === "booking") fetchBookings();
    if (activeTab === "landing") fetchLandingContent();
    if (activeTab === "settings") fetchThemeSettings();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "layanan") fetchLayanan();
  }, [activeTab]);

  // === DASHBOARD OVERVIEW ===
  const [overview, setOverview] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalLayanan: 0,
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [b, u, l] = await Promise.all([axios.get(API_URL_BOOKING), axios.get(API_URL_USERS), axios.get(API_URL_LAYANAN)]);
        setOverview({
          totalBookings: Array.isArray(b.data) ? b.data.length : 0,
          totalUsers: Array.isArray(u.data) ? u.data.length : 0,
          totalLayanan: Array.isArray(l.data) ? l.data.length : 0,
        });
      } catch (err) {
        console.error("fetchOverview:", err);
      }
    };
    fetchOverview();
    // also refresh when relevant data changes could be added
  }, []);

  // === FETCHERS ===
  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_URL_BOOKING);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchBookings:", err);
    }
  };
  const fetchLandingContent = async () => {
    try {
      const res = await axios.get(API_URL_LANDING);
      setContent(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchLandingContent:", err);
    }
  };
  const fetchThemeSettings = async () => {
    try {
      const res = await axios.get(API_URL_THEME);
      if (res.data) setThemeSettings(res.data);
    } catch (err) {
      console.error("fetchThemeSettings:", err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL_USERS);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchUsers:", err);
    }
  };
  const fetchLayanan = async () => {
    try {
      const res = await axios.get(API_URL_LAYANAN);
      setLayanan(
        (res.data || []).map((l) => ({
          ...l,
          imageFullUrl: l.image ? `http://localhost:5000/uploads/${l.image}` : null,
        }))
      );
    } catch (err) {
      console.error("fetchLayanan:", err);
      alert("❌ Gagal mengambil data layanan.");
    }
  };

  // === LOGOUT ===
  const handleLogout = () => {
    localStorage.removeItem("role");
    alert("Anda telah logout dari Admin Dashboard");
    navigate("/login");
  };

  // ===========================
  // === USERS CRUD ===========
  // ===========================
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await axios.delete(`${API_URL_USERS}/${id}`);
      await fetchUsers();
      alert("✅ User berhasil dihapus!");
    } catch (err) {
      console.error("handleDeleteUser:", err);
      alert("❌ Gagal menghapus user.");
    }
  };

  // ===========================
  // === THEME SAVE ===========
  // ===========================
  const handleSaveTheme = async () => {
    try {
      await axios.put(API_URL_THEME, themeSettings);
      alert("✅ Tema berhasil diperbarui!");
    } catch (err) {
      console.error("handleSaveTheme:", err);
      alert("❌ Gagal menyimpan tema.");
    }
  };

  // ===========================
  // === BOOKING HANDLERS =====
  // ===========================
  const handleChangeBooking = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.ruangan || !form.tanggal) {
      alert("Nama, Ruangan, dan Tanggal wajib diisi!");
      return;
    }
    try {
      if (editMode && (form.id || form._id)) {
        const id = form.id || form._id;
        await axios.put(`${API_URL_BOOKING}/${id}`, form);
        alert("✅ Data booking diperbarui!");
      } else {
        await axios.post(API_URL_BOOKING, form);
        alert("✅ Data booking ditambahkan!");
      }
      setForm({
        id: null,
        nama: "",
        telepon: "",
        ruangan: "",
        tanggal: "",
        jam_mulai: "",
        durasi: 1,
        detail: "",
        catatan: "",
      });
      setEditMode(false);
      await fetchBookings();
    } catch (err) {
      console.error("handleSubmitBooking:", err);
      alert("❌ Gagal menyimpan data booking.");
    }
  };

  const handleEditBooking = (b) => {
    setForm({
      id: b.id || b._id || null,
      nama: b.nama || "",
      telepon: b.telepon || "",
      ruangan: b.ruangan || "",
      tanggal: b.tanggal ? new Date(b.tanggal).toISOString().split("T")[0] : "",
      jam_mulai: b.jam_mulai || "",
      durasi: b.durasi || 1,
      detail: b.detail || "",
      catatan: b.catatan || "",
    });
    setEditMode(true);
    setActiveTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`${API_URL_BOOKING}/${id}`);
      await fetchBookings();
      alert("✅ Booking dihapus!");
    } catch (err) {
      console.error("handleDeleteBooking:", err);
      alert("❌ Gagal menghapus booking.");
    }
  };

  // ===========================
  // === LANDING HANDLERS =====
  // ===========================
  const handleEditLanding = (section) => {
    console.log("Edit diklik:", section);
    setEditing(section.section || section.id || section.name);
    setLandingForm({ ...section });
    setActiveTab("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveLanding = async () => {
    if (!editing) return;
    try {
      await axios.put(`${API_URL_LANDING}/${editing}`, landingForm);
      alert("✅ Konten berhasil diperbarui!");
      setEditing(null);
      await fetchLandingContent();
    } catch (err) {
      console.error("handleSaveLanding:", err);
      alert("❌ Gagal menyimpan konten landing.");
    }
  };

  // ===========================
  // === HANDLE CHANGE FORM ====
  // ===========================
  const handleChangeLayanan = (e) => {
    const { name, value } = e.target;
    setFormLayanan((prev) => ({ ...prev, [name]: value }));
  };

  // ===========================
  // === HANDLE FILE UPLOAD ====
  // ===========================
  const handleFileChangeForLayanan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simpan file di state, buat preview sementara
    const localPreview = URL.createObjectURL(file);
    setFormLayanan((prev) => ({ ...prev, file, image: localPreview }));

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(API_URL_LAYANAN_UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend harus mengembalikan { image: "nama_file.jpg" } atau URL lengkap
      const uploadedUrl = res.data.image || res.data.imageUrl;
      if (uploadedUrl) {
        // Jika backend hanya mengirim nama file, tambahkan prefix URL uploads
        const fullUrl = uploadedUrl.startsWith("http") ? uploadedUrl : `http://localhost:5000/uploads/${uploadedUrl}`;

        setFormLayanan((prev) => ({
          ...prev,
          image: fullUrl, // ganti preview lokal dengan URL server
          file: null, // reset file
        }));
      } else {
        alert("❌ Upload gagal, tidak ada URL yang diterima.");
        setFormLayanan((prev) => ({ ...prev, image: "", file: null }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Gagal upload gambar.");
      setFormLayanan((prev) => ({ ...prev, image: "", file: null }));
    } finally {
      setUploading(false);
    }
  };

  // ===========================
  // === HANDLE SUBMIT ========
  // ===========================
  const handleSubmitLayanan = async (e) => {
    e.preventDefault();
    if (!formLayanan.title || !formLayanan.description) {
      alert("Judul dan deskripsi wajib diisi!");
      return;
    }

    // Jangan submit jika file sedang diupload
    if (uploading) {
      alert("❌ Tunggu proses upload selesai!");
      return;
    }

    // Validasi image: harus URL backend atau kosong
    const imageUrl = formLayanan.image && formLayanan.image.startsWith("http") ? formLayanan.image : null;

    try {
      const payload = {
        title: formLayanan.title,
        description: formLayanan.description,
        image: imageUrl,
      };

      if (editLayananMode && (formLayanan.id || formLayanan._id)) {
        const id = formLayanan.id || formLayanan._id;
        await axios.put(`${API_URL_LAYANAN}/${id}`, payload);
        alert("✅ Layanan berhasil diperbarui!");
      } else {
        await axios.post(API_URL_LAYANAN, payload);
        alert("✅ Layanan berhasil ditambahkan!");
      }

      // Reset form
      setFormLayanan({ id: null, title: "", description: "", image: "" });
      setEditLayananMode(false);
      await fetchLayanan();
    } catch (err) {
      console.error("handleSubmitLayanan:", err);
      alert("❌ Gagal menyimpan layanan.");
    }
  };

  // ===========================
  // === EDIT / DELETE ========
  // ===========================
  const handleEditLayanan = (item) => {
    setFormLayanan({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.imageUrl || item.image || "", // HARUS URL backend
    });
    setEditLayananMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteLayanan = async (id) => {
    if (!window.confirm("Yakin ingin menghapus layanan ini?")) return;
    try {
      await axios.delete(`${API_URL_LAYANAN}/${id}`);
      await fetchLayanan();
      alert("✅ Layanan dihapus!");
    } catch (err) {
      console.error("handleDeleteLayanan:", err);
      alert("❌ Gagal menghapus layanan.");
    }
  };

  // ===========================
  // === IMAGE PREVIEW MODAL ===
  // ===========================
  const openImagePreview = (item) => {
    setSelectedImage(item); // simpan object lengkap
  };

  const closeImagePreview = () => setSelectedImage(null);

  const prettyTanggal = (b) => {
    if (b.tanggal) return b.tanggal;

    if (b.slots && b.slots.length) {
      // contoh: "Multi (3 slot)"
      return `Multi (${b.slots.length} slot)`;
    }

    return "-";
  };

  const prettyJam = (b) => {
    if (b.jam_mulai) return b.jam_mulai;

    if (b.slots && b.slots.length) {
      return b.slots.map((s) => `${s.date} ${String(s.startHour).padStart(2, "0")}:00`).join(", ");
    }
    return "-";
  };

  // ===========================
  // === JSX RENDER ===========
  // ===========================
  return (
    <div className={`flex min-h-screen font-[${themeSettings.theme_font}] transition-all duration-500 ${currentColor.bgMain} ${currentColor.textMain}`}>
      {/* === SIDEBAR === */}
      <aside className={`w-64 ${currentColor.sidebarBg} ${currentColor.sidebarText} backdrop-blur-md border-r ${currentColor.cardBorder} flex flex-col justify-between py-6 shadow-lg`}>
        <div>
          <div className="flex flex-col items-center mb-8">
            <img src={image14} alt="Logo" className="w-14 h-14 mb-2 rounded-full ring-2 ring-orange-400 shadow-lg hover:scale-110 transition-transform" />
            <h2 className="text-lg font-semibold text-orange-600 mt-2">Admin Panel</h2>
          </div>

          {/* === NAVIGATION === */}
          <nav className="flex flex-col space-y-2 px-4">
            {[
              { id: "dashboardoverview", icon: <FaTachometerAlt />, label: "Dashboard Overview" },
              { id: "booking", icon: <FaCalendarCheck />, label: "Kelola Booking" },
              { id: "users", icon: <FaUserFriends />, label: "Kelola User" },
              { id: "layanan", icon: <FaBoxes />, label: "Kelola Layanan" },
              { id: "landing", icon: <FaLayerGroup />, label: "Landing Page" },
              { id: "settings", icon: <FaPalette />, label: "Pengaturan Tema" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  activeTab === tab.id ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg scale-[1.02]" : `${currentColor.hoverBg} hover:translate-x-1`
                }`}
              >
                <span className={`text-lg ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110 text-orange-400"}`}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* === LOGOUT === */}
        <div className="text-center mt-8">
          <button onClick={handleLogout} className={`${currentColor.buttonDanger} text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2 mx-auto hover:shadow-lg hover:scale-105 transition-all`}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-8 overflow-y-auto">
        <nav className={`flex justify-between items-center ${currentColor.cardBg} border ${currentColor.cardBorder} shadow-md rounded-xl px-6 py-4 mb-8`}>
          <h1 className="text-xl font-semibold capitalize">
            {activeTab === "dashboardoverview" && "Dashboard Overview"}
            {activeTab === "booking" && "Kelola Booking"}
            {activeTab === "users" && "Kelola User"}
            {activeTab === "layanan" && "Kelola Layanan"}
            {activeTab === "landing" && "Kelola Landing Page"}
            {activeTab === "settings" && "Pengaturan Tema"}
          </h1>
          <button onClick={() => navigate("/")} className={`${currentColor.buttonGradient} text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg hover:scale-105 transition-all`}>
            Kembali ke Landing Page
          </button>
        </nav>

        {/* === DASHBOARD OVERVIEW === */}
        {activeTab === "dashboardoverview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: "Total Booking", value: overview.totalBookings, color: "text-orange-500" },
              { title: "Total Users", value: overview.totalUsers, color: "text-blue-500" },
              { title: "Total Layanan", value: overview.totalLayanan, color: "text-green-500" },
            ].map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder} ${currentColor.cardBg} hover:scale-105 transition-all`}>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* === TAB USERS === */}
        {activeTab === "users" && (
          <div className={`${currentColor.cardBg} p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder} overflow-x-auto`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-orange-500" /> Kelola User Terdaftar
            </h2>

            {/* === TABEL USER === */}
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Belum ada user yang terdaftar.</p>
            ) : (
              <table className="w-full border-collapse text-sm text-center">
                <thead>
                  <tr className={`${currentColor.tableHeader}`}>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Tanggal Dibuat</th>
                    <th className="border p-2 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const id = u.id || u._id;
                    const created = u.created_at || u.createdAt || u.created || null;
                    return (
                      <tr key={id || i}>
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{u.name}</td>
                        <td className="border p-2">{u.email}</td>
                        <td className="border p-2 capitalize">{u.role}</td>
                        <td className="border p-2">{created ? new Date(created).toLocaleString() : "-"}</td>
                        <td className="border p-2">
                          <button onClick={() => handleDeleteUser(id)} className={`${currentColor.buttonDanger} text-white px-2 py-1 rounded text-xs flex items-center gap-1 mx-auto`}>
                            <FaTrash /> Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* === TAB LAYANAN === */}
        {activeTab === "layanan" && (
          <div className={`${currentColor.cardBg} p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaImage className="text-orange-500" /> Kelola Layanan
            </h2>

            {/* Form Layanan */}
            <form onSubmit={handleSubmitLayanan} className="grid md:grid-cols-3 gap-3 mb-6">
              <input
                type="text"
                name="title"
                value={formLayanan.title}
                onChange={handleChangeLayanan}
                placeholder="Judul layanan"
                className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
              />

              <input
                type="text"
                name="description"
                value={formLayanan.description}
                onChange={handleChangeLayanan}
                placeholder="Deskripsi"
                className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
              />

              <input
                type="text"
                name="image"
                value={formLayanan.image}
                onChange={handleChangeLayanan}
                placeholder="URL Gambar (atau kosong jika upload file)"
                className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
              />

              {/* File Upload */}
              <input type="file" accept="image/*" onChange={handleFileChangeForLayanan} className={`col-span-3 ${currentColor.textMain}`} />

              {/* Preview Gambar */}
              {(formLayanan.file || formLayanan.image) && (
                <div className="col-span-3 flex justify-center mb-2">
                  <img src={formLayanan.file ? URL.createObjectURL(formLayanan.file) : formLayanan.image} alt="Preview Layanan" className="w-48 h-32 object-cover rounded border" />
                </div>
              )}

              <button type="submit" disabled={uploading} className={`${currentColor.buttonGradient} text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition col-span-3`}>
                {editLayananMode ? "Simpan Perubahan" : "Tambah Layanan"}
              </button>
            </form>

            {/* Grid Layanan */}
            {layanan.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada data layanan.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {layanan.map((l, i) => {
                  const id = l.id || l._id || i;
                  const imageSrc = l.image ? `http://localhost:5000/uploads/${l.image}` : "https://via.placeholder.com/300";

                  return (
                    <div key={id} className={`p-4 border ${currentColor.cardBorder} ${currentColor.cardBg} rounded-xl shadow-md`}>
                      <img src={imageSrc} alt={l.title} className="w-full h-40 object-cover rounded mb-3" />
                      <h3 className="font-semibold text-lg">{l.title}</h3>
                      <p className="text-sm mb-3">{l.description}</p>
                      <div className="flex justify-between">
                        <button onClick={() => handleEditLayanan(l)} className={`${currentColor.buttonPrimary} text-white px-3 py-1 rounded text-xs flex items-center gap-1`}>
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDeleteLayanan(id)} className={`${currentColor.buttonDanger} text-white px-3 py-1 rounded text-xs flex items-center gap-1`}>
                          <FaTrash /> Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* === TAB SETTINGS === */}
        {activeTab === "settings" && (
          <div className={`${currentColor.cardBg} p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder} max-w-lg mx-auto`}>
            <h2 className="text-lg font-semibold mb-4">🎨 Pengaturan Tema</h2>
            <label className="block mb-3 font-medium">Pilih Warna Tema</label>
            <select value={themeSettings.theme_color} onChange={(e) => setThemeSettings({ ...themeSettings, theme_color: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 mb-4">
              <option value="orange">🟠 Orange</option>
              <option value="light">🌤️ Terang</option>
              <option value="dark">🌙 Gelap</option>
            </select>

            <label className="block mb-3 font-medium">Pilih Font</label>
            <select value={themeSettings.theme_font} onChange={(e) => setThemeSettings({ ...themeSettings, theme_font: e.target.value })} className="w-full border border-gray-300 rounded-lg p-2 mb-4">
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
            </select>

            <button onClick={handleSaveTheme} className={`${currentColor.buttonGradient} text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition`}>
              <FaSave /> Simpan Pengaturan
            </button>
          </div>
        )}

        {/* === TAB BOOKING === */}
        {activeTab === "booking" && (
          <>
            <div className="space-y-8">
              {/* === TABEL === */}
              <div className={`${currentColor.cardBg} backdrop-blur-sm border ${currentColor.cardBorder} shadow-xl rounded-2xl p-6 overflow-x-auto`}>
                <h2 className="text-lg font-semibold mb-4">Daftar Booking Customer</h2>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">Belum ada data booking.</p>
                ) : (
                  <table className="w-full border-collapse text-sm text-center">
                    <thead>
                      <tr className={`${currentColor.tableHeader}`}>
                        <th className="border p-2">No</th>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Telepon</th>
                        <th className="border p-2">Ruangan</th>
                        <th className="border p-2">Tanggal</th>
                        <th className="border p-2">Jam</th>
                        <th className="border p-2">Durasi</th>
                        <th className="border p-2">Detail</th>
                        <th className="border p-2">Catatan</th>
                        <th className="border p-2 w-32">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => {
                        const id = b.id || b._id || i;
                        return (
                          <tr key={id}>
                            <td className="border p-2">{i + 1}</td>
                            <td className="border p-2">{b.nama}</td>
                            <td className="border p-2">{b.telepon}</td>
                            <td className="border p-2">{b.ruangan}</td>
                            <td className="border p-2">{b.tanggal ? new Date(b.tanggal).toLocaleDateString("id-ID") : "-"}</td>
                            <td className="border p-2">{b.jam_mulai || "-"}</td>
                            <td className="border p-2">{b.durasi || "-"} jam</td>
                            <td className="border p-2">{b.detail}</td>
                            <td className="border p-2">{b.catatan}</td>
                            <td className="border p-2 flex justify-center gap-2">
                              <button onClick={() => handleEditBooking(b)} className={`${currentColor.buttonPrimary} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                                <FaEdit /> Edit
                              </button>
                              <button onClick={() => handleDeleteBooking(id)} className={`${currentColor.buttonDanger} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                                <FaTrash /> Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* === FORM === */}
              <div className={`${currentColor.cardBg} backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-10 border ${currentColor.cardBorder}`}>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${currentColor.textMain}`}>
                  <FaPlus className={themeSettings.theme_color === "dark" ? "text-indigo-400" : themeSettings.theme_color === "light" ? "text-blue-500" : "text-orange-500"} />
                  {editMode ? "Edit Booking" : "Tambah Booking"}
                </h2>

                <form onSubmit={handleSubmitBooking} className="grid md:grid-cols-2 gap-4">
                  {["nama", "telepon", "detail"].map((f) => (
                    <input
                      key={f}
                      type="text"
                      name={f}
                      value={form[f]}
                      onChange={handleChangeBooking}
                      placeholder={f === "nama" ? "Nama Customer" : f === "telepon" ? "Nomor Telepon" : "Detail Pesanan"}
                      className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
                    />
                  ))}

                  <select
                    name="ruangan"
                    value={form.ruangan}
                    onChange={handleChangeBooking}
                    className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
                  >
                    <option value="">Pilih Ruangan</option>
                    <option value="Ruang Podcast">Ruang Podcast</option>
                    <option value="Ruang Meeting">Ruang Meeting</option>
                    <option value="Ruang Kerja">Ruang Kerja</option>
                    <option value="Studio">Studio</option>
                  </select>

                  <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChangeBooking}
                    className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
                  />

                  <input
                    type="time"
                    name="jam_mulai"
                    value={form.jam_mulai}
                    onChange={handleChangeBooking}
                    className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
                  />

                  <input
                    type="number"
                    name="durasi"
                    min="1"
                    value={form.durasi}
                    onChange={handleChangeBooking}
                    className={`${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
                  />

                  <textarea
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChangeBooking}
                    placeholder="Catatan tambahan..."
                    rows="3"
                    className={`md:col-span-2 ${currentColor.inputBg} ${currentColor.textMain} border ${currentColor.cardBorder} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-300`}
                  ></textarea>

                  <button type="submit" className={`${currentColor.buttonPrimary} text-white py-2 rounded-lg hover:shadow-lg transition col-span-2`}>
                    {editMode ? "Update Data" : "Tambah Booking"}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* === TAB LANDING PAGE === */}
        {activeTab === "landing" && (
          <div className="space-y-8">
            {/* === TABEL KONTEN LANDING === */}
            <table className="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead className={`${currentColor.tableHeader}`}>
                <tr>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Subtitle</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {content.map((c) => {
                  const id = c.id || c._id || c.section || Math.random();
                  return (
                    <tr key={id}>
                      <td className="border p-2">{c.section}</td>
                      <td className="border p-2">{c.title}</td>
                      <td className="border p-2">{c.subtitle}</td>
                      <td className="border p-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEditLanding(c)} className="bg-orange-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-orange-600">
                            <FaEdit /> Edit
                          </button>
                          {c.image && (
                            <button onClick={() => openImagePreview(c)} className="bg-white border px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-orange-50">
                              <FaEye /> Lihat Gambar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* === FORM EDIT LANDING === */}
            {editing && (
              <div className={`mt-6 p-4 rounded-xl shadow-inner ${themeSettings.theme_color === "dark" ? "bg-gray-800 border border-gray-700" : "bg-orange-50 border border-orange-100"}`}>
                <h3 className="font-semibold mb-2 capitalize">Edit {editing}</h3>

                <input
                  type="text"
                  value={landingForm.title || ""}
                  onChange={(e) => setLandingForm({ ...landingForm, title: e.target.value })}
                  placeholder="Title"
                  className={`w-full mb-2 p-2 rounded-lg border transition-all duration-300 ${
                    themeSettings.theme_color === "dark" ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500" : "bg-white text-gray-800 border-orange-200 focus:ring-2 focus:ring-orange-300"
                  }`}
                />

                <textarea
                  value={landingForm.subtitle || ""}
                  onChange={(e) => setLandingForm({ ...landingForm, subtitle: e.target.value })}
                  placeholder="Subtitle"
                  rows="3"
                  className={`w-full mb-2 p-2 rounded-lg border transition-all duration-300 ${
                    themeSettings.theme_color === "dark" ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500" : "bg-white text-gray-800 border-orange-200 focus:ring-2 focus:ring-orange-300"
                  }`}
                />

                <input
                  type="text"
                  value={landingForm.button_text || ""}
                  onChange={(e) => setLandingForm({ ...landingForm, button_text: e.target.value })}
                  placeholder="Teks Tombol"
                  className={`w-full mb-2 p-2 rounded-lg border transition-all duration-300 ${
                    themeSettings.theme_color === "dark" ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500" : "bg-white text-gray-800 border-orange-200 focus:ring-2 focus:ring-orange-300"
                  }`}
                />

                <input
                  type="text"
                  value={landingForm.button_link || ""}
                  onChange={(e) => setLandingForm({ ...landingForm, button_link: e.target.value })}
                  placeholder="Link Tombol"
                  className={`w-full mb-4 p-2 rounded-lg border transition-all duration-300 ${
                    themeSettings.theme_color === "dark" ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500" : "bg-white text-gray-800 border-orange-200 focus:ring-2 focus:ring-orange-300"
                  }`}
                />

                <input
                  type="text"
                  value={landingForm.image || ""}
                  onChange={(e) => setLandingForm({ ...landingForm, image: e.target.value })}
                  placeholder="URL Gambar"
                  className={`w-full mb-2 p-2 rounded-lg border transition-all duration-300 ${
                    themeSettings.theme_color === "dark" ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500" : "bg-white text-gray-800 border-orange-200 focus:ring-2 focus:ring-orange-300"
                  }`}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const uploadedUrl = await handleUploadImageFile(file);
                    if (uploadedUrl) setLandingForm({ ...landingForm, image: uploadedUrl });
                  }}
                  className={`w-full mb-2 ${themeSettings.theme_color === "dark" ? "text-gray-200" : "text-gray-700"}`}
                />

                <button onClick={handleSaveLanding} className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition">
                  <FaSave /> Simpan Konten
                </button>
              </div>
            )}

            {/* === REVIEW & RATING ADMIN === */}
            <div className={`${currentColor.cardBg} p-6 rounded-2xl shadow-xl border ${currentColor.cardBorder}`}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUsers className="text-orange-500" /> Kelola Review Landing Page
              </h2>

              <table className="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className={`${currentColor.tableHeader}`}>
                  <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Role</th>
                    <th className="p-2 border">Rating</th>
                    <th className="p-2 border">Komentar</th>
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r, i) => {
                    const id = r.id || r._id;
                    const isEditing = editingReviewId === id;

                    return (
                      <tr key={id}>
                        <td className="border p-2">{i + 1}</td>

                        <td className="border p-2">
                          {isEditing ? <input type="text" name="name" value={reviewForm.name} onChange={handleChangeReviewForm} className={`${currentColor.inputBg} border ${currentColor.cardBorder} rounded px-2 py-1`} /> : r.name}
                        </td>

                        <td className="border p-2">
                          {isEditing ? <input type="text" name="role" value={reviewForm.role} onChange={handleChangeReviewForm} className={`${currentColor.inputBg} border ${currentColor.cardBorder} rounded px-2 py-1`} /> : r.role}
                        </td>

                        <td className="border p-2">
                          {isEditing ? (
                            <input type="number" name="rating" min="1" max="5" value={reviewForm.rating} onChange={handleChangeReviewForm} className={`${currentColor.inputBg} border ${currentColor.cardBorder} rounded px-2 py-1 w-16`} />
                          ) : (
                            r.rating
                          )}
                        </td>

                        <td className="border p-2">
                          {isEditing ? <textarea name="comment" value={reviewForm.comment} onChange={handleChangeReviewForm} className={`${currentColor.inputBg} border ${currentColor.cardBorder} rounded px-2 py-1 w-full`} /> : r.comment}
                        </td>

                        <td className="border p-2 flex gap-2">
                          {isEditing ? (
                            <button onClick={handleSaveReview} className={`${currentColor.buttonPrimary} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                              <FaSave /> Simpan
                            </button>
                          ) : (
                            <button onClick={() => handleEditReview(r)} className="bg-orange-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-orange-600">
                              <FaEdit /> Edit
                            </button>
                          )}

                          <button onClick={() => handleDeleteReview(id)} className={`${currentColor.buttonDanger} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                            <FaTrash /> Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* === MODAL PREVIEW IMAGE (FRAMER MOTION) === */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeImagePreview}>
            <motion.div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{selectedImage.title || selectedImage.name || selectedImage.section || "Preview"}</h3>
                <button onClick={closeImagePreview} className="text-gray-500 hover:text-gray-800">
                  Tutup
                </button>
              </div>
              <div className="mt-4">
                <img
                  src={selectedImage.image || selectedImage.image_url || selectedImage.imageUrl || "https://via.placeholder.com/800x400"}
                  alt={selectedImage.title || selectedImage.name || "Preview"}
                  className="w-full object-contain rounded-lg"
                />
                {selectedImage.description && <p className="mt-3 text-gray-600">{selectedImage.description}</p>}
                {selectedImage.subtitle && <p className="mt-3 text-gray-600">{selectedImage.subtitle}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
