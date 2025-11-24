import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qrisImage from "../assets/qris.png";
import image14 from "../assets/image14.png";
import paymentAnimVideo from "../assets/payment-anim.mp4";
import { QRCodeCanvas } from "qrcode.react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  // data yang dikirim dari Booking.jsx via navigate
  const {
    bookingId,
    selections = [],
    total = 0,
    subtotal = 0,
    discountAmount = 0,
    name = "-",
    phone = "-",
    room = null,
    paymentDeadline,
    qris = null, // { referenceId, qrData, amount }
    qrData: qrDataFromState = "", // jaga-jaga kalau kamu kirim qrData langsung
    paymentStatus: paymentStatusFromState = "pending",
  } = state;

  // value yang dipakai QRCode
  const qrValue = qris?.qrData || qrDataFromState || "";

  // STATE UNTUK NAVBAR
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);

  // STATE STATUS PEMBAYARAN
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [checking, setChecking] = useState(false);
  const isPaid = paymentStatus === "paid";
  const isCancelled = paymentStatus === "cancelled";

  // redirect kalau masuk tanpa data
  useEffect(() => {
    if (!bookingId && !selections.length) {
      navigate("/booking", { replace: true });
    }
  }, [bookingId, selections.length, navigate]);

  // efek scroll navbar
  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // helper format tanggal
  const formatLongDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const toIDR = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(n || 0);

  const pad2 = (n) => String(n).padStart(2, "0");

  const displayRoomName = room?.name || selections[0]?.roomName || "Ruangan";

  // === CEK STATUS PEMBAYARAN KE BACKEND ===
  async function checkStatus() {
    if (!bookingId) return;

    try {
      const resp = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`);
      const data = await resp.json();

      if (data.success && data.booking?.paymentStatus) {
        setPaymentStatus(data.booking.paymentStatus);
      }
    } catch (err) {
      console.error("Gagal cek status pembayaran:", err);
    }
  }

  useEffect(() => {
    checkStatus();
    const timer = setInterval(checkStatus, 5000);
    return () => clearInterval(timer);
  }, [bookingId]);

  // warna status
  const statusColorClass = paymentStatus === "paid" ? "text-green-400" : paymentStatus === "cancelled" ? "text-red-400" : "text-pink-400";

  return (
    <div className="min-h-screen bg-[#222] text-white font-[Poppins]">
      {/* === NAVBAR === */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scroll ? "bg-[#0d1224]/95 shadow-md backdrop-blur-md py-2" : "bg-white py-4"} border-b ${scroll ? "border-[#0d1224]/40" : "border-gray-200/30"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={image14} alt="Logo" className="w-10 h-10 rounded-full drop-shadow-md object-cover" />
            <div>
              <h1 className={`font-extrabold tracking-tight text-lg md:text-xl bg-clip-text text-transparent ${scroll ? "bg-gradient-to-r from-blue-300 to-cyan-300" : "bg-gradient-to-r from-blue-600 to-cyan-400"}`}>VOXPRO HUB</h1>
              <p className={`text-xs -mt-0.5 ${scroll ? "text-gray-200" : "text-gray-500"}`}>Creative Voxprohub • Makassar</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex gap-8 items-center font-medium text-sm ${scroll ? "text-gray-200" : "text-gray-700"}`}>
            {[{ name: "Beranda", path: "/" }].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)} className={`relative group px-2 py-1 rounded-md transition-colors ${scroll ? "hover:text-blue-300" : "hover:text-blue-600"}`}>
                {item.name}
                <span
                  className={`absolute left-0 bottom-0 w-0 h-[2px] rounded transition-all duration-300 ${
                    scroll ? "bg-gradient-to-r from-blue-300 to-cyan-300 group-hover:w-full" : "bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full"
                  }`}
                ></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setOpen((o) => !o)}>
            <svg className={`w-6 h-6 transition-colors duration-500 ${scroll ? "text-white" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-64 py-4" : "max-h-0"} ${scroll ? "bg-[#0d1224]/95" : "bg-white/90 backdrop-blur-md"}`}>
          <div className="flex flex-col items-center gap-3 font-medium text-sm">
            {[
              { name: "Beranda", path: "/" },
              { name: "Booking", path: "/booking" },
            ].map((item, i) => (
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

      {/* HEADER */}
      {isPaid ? (
        <div className="bg-emerald-500 flex flex-col items-center justify-center min-h-[fullscreen] md:min-h-screen mt-2 px-4">
          <div className="mx-auto w-40 h-40 mb-6">
            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success" className="w-full h-full animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Pembayaran Berhasil</h1>
          <p className="text-sm text-white/90">Booking kamu telah dikonfirmasi.</p>
        </div>
      ) : (
        <div className="bg-[#ffd93b] text-center py-20 mt-16">
          <div className="mx-auto w-64 h-64 mb-6">
            <video src={paymentAnimVideo} autoPlay loop muted playsInline className="w-64 h-64 mx-auto"></video>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-black">Menunggu Pembayaran</h1>
          <p className="text-sm text-black/80">Silakan lakukan pembayaran dengan metode yang kamu pilih.</p>
        </div>
      )}

      {/* PROGRESS BAR */}
      <div className="bg-[#111] py-12">
        <div className="max-w-5xl mx-auto text-sm">
          <p className="font-semibold mb-2">Progress Transaksi</p>

          <div className="flex items-center gap-6">
            {/* STEP 1 - SELALU BERHASIL */}
            <div className="flex-1 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">✓</div>
              <div>
                <div className="font-semibold text-green-400">Transaksi Dibuat</div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="flex-1 flex items-center gap-3">
              {isPaid ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">✓</div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-orange-400 flex items-center justify-center text-orange-300 text-lg">⍟</div>
              )}

              <div>
                <div className={`font-semibold ${isPaid ? "text-green-400" : "text-orange-300"}`}>Pembayaran</div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="flex-1 flex items-center gap-3">
              {isPaid ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">✓</div>
              ) : (
                <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-gray-500 text-lg">✓</div>
              )}

              <div>
                <div className={`font-semibold ${isPaid ? "text-green-400" : "text-gray-300"}`}>Transaksi Selesai</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL + QR */}
      <div className="max-w-5xl mx-auto py-10 grid md:grid-cols-2 gap-8 px-4">
        {/* kiri: ringkasan pesanan */}
        <div className="bg-[#2b2b2b] rounded-2xl p-5">
          <h2 className="font-semibold text-lg mb-4">Informasi Booking</h2>

          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-400">Nama: </span>
              <span className="font-medium">{name}</span>
            </div>
            <div>
              <span className="text-gray-400">No. HP: </span>
              <span className="font-medium">{phone}</span>
            </div>
            <div>
              <span className="text-gray-400">Ruangan: </span>
              <span className="font-medium">{displayRoomName}</span>
            </div>
            <div>
              <span className="text-gray-400">ID Booking: </span>
              <span className="font-mono">{bookingId || "-"}</span>
            </div>
            {paymentDeadline && (
              <div className="text-xs text-gray-400 mt-1">
                Batas waktu pembayaran sampai:{" "}
                <span className="text-amber-300 font-medium">
                  {new Date(paymentDeadline).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-gray-600 pt-4">
            <h3 className="font-semibold mb-2 text-sm">Slot yang dipesan</h3>
            <div className="space-y-2 text-xs">
              {selections.map((s, i) => {
                const endH = s.startHour + s.duration;
                return (
                  <div key={`${s.date}-${s.startHour}-${i}`} className="bg-[#383838] rounded-xl px-3 py-2">
                    <div className="font-medium">{displayRoomName}</div>
                    <div>{formatLongDate(s.date)}</div>
                    <div>
                      {pad2(s.startHour)}:00–{pad2(Math.min(22, endH))}:00 • {s.duration} jam
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 border-t border-gray-600 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>{toIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Diskon</span>
              <span className="text-emerald-400">{toIDR(discountAmount)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-600">
              <span className="font-semibold">Total Pembayaran</span>
              <span className="font-semibold text-amber-300">{toIDR(total)}</span>
            </div>
          </div>
        </div>

        {/* Kanan: pembayaran */}
        <div className="bg-[#2b2b2b] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[430px]">
          {isPaid ? (
            <>
              {/* JUDUL */}
              <h2 className="font-semibold text-xl mb-6 text-center">Pembayaran Berhasil 🎉</h2>

              {/* GAMBAR */}
              <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="success" className="w-36 h-36 mb-6 animate-[pop_0.4s_ease]" />

              {/* TEKS */}
              <p className="text-sm text-gray-300 text-center mb-6 px-4 leading-relaxed">Terima kasih! Pembayaran kamu sudah dikonfirmasi. Booking kamu sudah aktif dan siap digunakan.</p>

              {/* BUTTON */}
              <button onClick={() => navigate("/")} className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition">
                Kembali ke Beranda
              </button>
            </>
          ) : (
            <>
              {/* QR NORMAL */}
              <h2 className="font-semibold text-lg mb-4 self-start">Metode Pembayaran</h2>

              {qrValue ? (
                <div className="bg-white p-3 rounded-2xl mb-4">
                  <QRCodeCanvas value={qrValue} size={224} />
                </div>
              ) : (
                <img src={qrisImage} className="w-56 h-56 mb-4" />
              )}

              <p className="text-xs text-gray-300 text-center mb-2">Scan QR di atas untuk melakukan pembayaran.</p>

              <button onClick={checkStatus} className="mt-2 px-4 py-1 rounded-full bg-pink-500 text-xs text-white">
                Cek Status Pembayaran
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
