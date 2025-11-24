import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import image14 from "../assets/image14.png";
import qrisImage from "../assets/qris.png";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;
const ADMIN_WHATSAPP = "6285242008058";
const pad2 = (n) => String(n).padStart(2, "0");
const toIDR = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

const toLocalDateStr = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${y}-${m}-${dd}`;
};

// Promo definitions (percent discount)
const PROMOS = {
  hemat50: 0.5,
  hemat20: 0.2,
  hemat10: 0.1,
};

export default function Booking() {
  const navigate = useNavigate();
  const [scroll, setScroll] = useState(false);

  // Rooms with capacities & description
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selections, setSelections] = useState([]);
  const [duration, setDuration] = useState(1);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [bookingsRaw, setBookingsRaw] = useState([]);

  // form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [localBookingIdCounter, setLocalBookingIdCounter] = useState(1000);

  // UI
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [toast, setToast] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLog, setAiLog] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSuggestions, setPreviewSuggestions] = useState([]);
  const [promoListOpen, setPromoListOpen] = useState(false);
  const [lastBookingId, setLastBookingId] = useState(null);
  const [paymentDeadline, setPaymentDeadline] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const clearSelection = () => {
    setSelectedRoom("");
    setselectedDate([]);
    setselectedTime([]);
    setDuration(1);
    setAppliedPromo(null);
    setPromoCode("");
    setNote("");
    setPaymentStatus("pending");
    setShowPayment(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    setRooms([
      { id: "POD", name: "Ruang Podcast", price: 100000, capacity: 4, desc: "Cocok untuk rekaman & podcast" },
      { id: "MEET", name: "Ruang Rapat", price: 150000, capacity: 8, desc: "Rapat tim / presentasi" },
      { id: "KRJ", name: "Ruang Kerja", price: 200000, capacity: 6, desc: "Coworking & kerja kelompok" },
      { id: "STD", name: "Studio", price: 1000, capacity: 12, desc: "Studio produksi & rekaman" },
    ]);

    // fetch bookings from backend and map to blocked slots
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        if (!res.ok) throw new Error("Network response not ok");
        const data = await res.json();
        setBookingsRaw(data);
        const slots = data.flatMap((b) => {
          const startHour = b.jam_mulai ? parseInt(b.jam_mulai.split(":")[0]) : OPEN_HOUR;
          const dur = b.durasi || 1;

          const tanggalArray = Array.isArray(b.tanggal) ? b.tanggal : [b.tanggal];

          return tanggalArray.map((tgl) => {
            const dateStr = typeof tgl === "string" && tgl.includes("T") ? toLocalDateStr(tgl) : tgl;

            return {
              roomId: b.ruangan,
              date: dateStr,
              start: startHour,
              end: startHour + dur,
              bookingId: b.id || null,
            };
          });
        });
        setBlockedSlots(slots);
      } catch (err) {
        console.error("❌ Gagal memuat data booking:", err);
        showToast("error", "Gagal memuat data booking (lihat console).");
      }
    };
    fetchBookings();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // === TOTAL & DISCOUNT CALCULATION ===
  const subtotal = useMemo(() => {
    return selections.reduce((sum, s) => {
      const room = rooms.find((r) => r.id === s.roomId);
      if (!room) return sum;
      return sum + room.price * s.duration;
    }, 0);
  }, [selections, rooms]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return subtotal * appliedPromo.discount;
  }, [subtotal, appliedPromo]);

  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const savingsPercent = useMemo(() => {
    if (!subtotal || !discountAmount) return 0;
    return Math.round((discountAmount / subtotal) * 100);
  }, [subtotal, discountAmount]);

  // === TIME OPTIONS ===
  const timeOptions = [];
  for (let i = OPEN_HOUR; i < CLOSE_HOUR; i++) {
    timeOptions.push(`${pad2(i)}:00`);
  }

  // === CALENDAR ===
  const generateDays = (month, year) => {
    const days = [];
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const lastDay = new Date(year, month + 1, 0);

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = toLocalDateStr(date); // ✅ pakai helper lokal

      const isPast = date < todayMidnight;

      const hasBooking = !!selectedRoom && blockedSlots.some((b) => b.date === dateStr && b.roomId === selectedRoom);

      days.push({
        date: dateStr,
        label: i,
        past: isPast,
        hasBooking,
      });
    }
    return days;
  };

  const days = generateDays(month, year);
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const toggleDate = (d) => {
    setSelectedDate(d === selectedDate ? "" : d);
  };

  const toggleTime = (t) => {
    setSelectedTime(t === selectedTime ? "" : t);
  };

  // helpers
  const isSlotBlocked = (roomId, date, startHour, durationCheck = 1) => {
    const endHour = startHour + durationCheck;
    return blockedSlots.some((b) => {
      if (b.roomId !== roomId || b.date !== date) return false;
      // overlap detection
      return Math.max(b.start, startHour) < Math.min(b.end, endHour);
    });
  };

  const addSelection = () => {
    if (!selectedRoom) {
      showToast("error", "Pilih ruangan terlebih dahulu.");
      return;
    }
    if (!selectedDate) {
      showToast("error", "Pilih tanggal terlebih dahulu.");
      return;
    }
    if (!selectedTime) {
      showToast("error", "Pilih jam terlebih dahulu.");
      return;
    }

    const startHour = selectedTime ? parseInt(selectedTime.split(":")[0], 10) : null;

    // Cek bentrok dengan blockedSlots dari backend
    if (isSlotBlocked(selectedRoom, selectedDate, startHour, duration)) {
      showToast("error", "Jam ini sudah dibooking / bentrok dengan slot lain.");
      return;
    }

    // Cek bentrok dengan selections yang sudah ada (tanggal & ruangan sama)
    const overlap = selections.some((s) => {
      if (s.roomId !== selectedRoom || s.date !== selectedDate) return false;
      const endHour = startHour + duration;
      const sEnd = s.startHour + s.duration;
      return Math.max(s.startHour, startHour) < Math.min(sEnd, endHour);
    });

    if (overlap) {
      showToast("error", "⚠️ Jam ini sudah ada di daftar pilihan.");
      return;
    }

    const room = rooms.find((r) => r.id === selectedRoom);

    const newSel = {
      roomId: selectedRoom,
      roomName: room ? room.name : selectedRoom,
      date: selectedDate,
      time: selectedTime,
      startHour,
      duration,
      pricePerHour: room ? room.price : 0,
    };

    setSelections((prev) => [...prev, newSel]);

    // reset pilihan aktif
    setSelectedDate("");
    setSelectedTime("");
    setDuration(1);
  };

  const removeSelection = (idx) => {
    setSelections((prev) => prev.filter((_, i) => i !== idx));
  };

  const openConfirmModal = () => {
    if (!selections.length) {
      showToast("error", "Belum ada slot yang ditambahkan.");
      return;
    }
    if (!selectedRoom || !phone) {
      showToast("error", "Isi ruangan & nomor HP dulu.");
      return;
    }

    setConfirmOpen(true);
  };

  // === TOAST ===
  function showToast(type, message, ms = 3500) {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, ms);
  }

  // === PROMO ===
  const applyPromo = (code) => {
    if (!code) {
      setAppliedPromo(null);
      setPromoCode("");
      showToast("info", "Masukkan kode promo");
      return;
    }
    const key = code.trim().toLowerCase();
    if (PROMOS[key]) {
      setAppliedPromo({ code: key, discount: PROMOS[key] });
      setPromoCode(key);
      showToast("success", `Promo '${key}' berhasil diterapkan (${Math.round(PROMOS[key] * 100)}% off).`);
    } else {
      showToast("error", `Kode promo '${code}' tidak dikenali.`);
    }
  };

  // === BOOKING PREVIEW / RECOMMENDER ===
  const generateRecommendations = () => {
    // Suggest rooms based on capacity and availability for selectedDate and selectedTime
    // Simple heuristic: prefer rooms with capacity >= needed (we don't have "needed" — use chosen room or default)
    const wantedCapacity = rooms.find((r) => r.id === selectedRoom)?.capacity || 4;
    const suggestions = rooms
      .map((r) => {
        // check availability on all selected dates and times
        const ok = selectedDate.every((d) =>
          selectedTime.every((t) => {
            const startH = parseInt(t.split(":")[0]);
            return !isSlotBlocked(r.id, d, startH, duration);
          })
        );
        return {
          ...r,
          available: ok,
          estCost: r.price * duration * selectedDate.length,
        };
      })
      .filter((s) => s.available)
      .sort((a, b) => {
        // prioritize capacity close to wanted and lower price
        const capDiffA = Math.abs(a.capacity - wantedCapacity);
        const capDiffB = Math.abs(b.capacity - wantedCapacity);
        if (capDiffA !== capDiffB) return capDiffA - capDiffB;
        return a.estCost - b.estCost;
      });
    setPreviewSuggestions(suggestions.slice(0, 4)); // up to 4 suggestions
    setPreviewOpen(true);
  };

  // === SUBMIT BOOKING ===
  const handleSubmitBooking = async (status = "pending") => {
    if (!selectedRoom || selections.length === 0 || !phone) {
      showToast("error", "Lengkapi ruangan, minimal satu slot booking, dan nomor telepon.");
      return false;
    }

    // Safety check: pastikan semua slot di selections tidak bentrok
    for (const sel of selections) {
      if (isSlotBlocked(sel.roomId, sel.date, sel.startHour, sel.duration)) {
        showToast("error", `Slot ${formatLongDate(sel.date)} ${pad2(sel.startHour)}:00 bertabrakan dengan booking lain.`);
        return false;
      }
    }

    // Hitung subtotal dari selections
    const subtotal = selections.reduce((sum, s) => {
      const room = rooms.find((r) => r.id === s.roomId);
      if (!room) return sum;
      return sum + room.price * s.duration;
    }, 0);

    const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
    const total = subtotal - discountAmount;

    // Payload: satu booking berisi banyak slot
    const payload = {
      nama: name,
      telepon: phone,
      ruangan: selectedRoom,
      tanggal: selections.map((s) => s.date), // array tanggal
      jam_mulai: selections.map((s) => `${pad2(s.startHour)}:00`).join(", "),
      durasi: selections[0]?.duration || 1, // bebas, pakai durasi slot pertama
      catatan: note,
      promo: appliedPromo ? appliedPromo.code : null,
      subtotal,
      discount: discountAmount,
      total,
      paymentStatus: status, // "pending" saat dipanggil dari popup
    };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!result || !result.success) {
        showToast("error", "❌ Gagal menyimpan booking. Cek server.");
        return false;
      }

      // kalau sukses:
      showToast("success", "✅ Booking berhasil dibuat (status pending).");

      const bookingId = result.id || result.bookingId || null;
      setLastBookingId(bookingId);
      setPaymentStatus(status); // biasanya "pending"

      // blok semua slot di state lokal
      const newSlots = selections.map((s) => ({
        roomId: s.roomId,
        date: s.date,
        start: s.startHour,
        end: s.startHour + s.duration,
        bookingId,
        status,
      }));
      setBlockedSlots((prev) => [...prev, ...newSlots]);

      return true;
    } catch (err) {
      console.error("❌ Gagal kirim booking:", err);
      showToast("error", "Gagal mengirim booking (lihat console).");
      return false;
    }
  };

  async function handleConfirmBooking() {
    if (!selectedRoom || selections.length === 0 || !phone) {
      showToast("error", "Lengkapi data dulu sebelum pesan.");
      return;
    }

    const firstSlot = selections[0];

    const payload = {
      nama: name,
      telepon: phone,
      ruangan: selectedRoom, // id / kode ruangan

      // ✅ untuk kompatibel dengan versi lama (tabel admin)
      tanggal: firstSlot.date, // "2025-11-24"
      jam_mulai: `${String(firstSlot.startHour).padStart(2, "0")}:00`,
      durasi: firstSlot.duration, // misal 2

      // ✅ simpan juga SEMUA slot multi-hari
      slots: selections.map((s) => ({
        date: s.date,
        startHour: s.startHour,
        duration: s.duration,
        roomId: s.roomId,
        roomName: s.roomName,
      })),

      subtotal,
      discount: discountAmount,
      total,
      paymentStatus: "pending",
    };

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    // ... lanjut logic sukses / error + redirect ke PaymentPage
  }

  // === NOTIFY ADMIN VIA WHATSAPP (prefilled message) ===
  const notifyAdminWhatsApp = (payload, bookingId) => {
    const room = rooms.find((r) => r.id === payload.ruangan);

    // === Format pesan WA ===
    const message = `
Halo Admin VoxProHub! 👋

Saya ingin melakukan booking dengan detail berikut:

🆔 ID: ${bookingId || "-"}
👤 Nama: ${payload.nama || "-"}
📞 HP: ${payload.telepon || "-"}
🏢 Ruangan: ${room ? room.name : payload.ruangan}
📅 Tanggal: ${payload.tanggal.join ? payload.tanggal.join(", ") : payload.tanggal}
⏰ Jam Mulai: ${payload.jam_mulai}
⏳ Durasi: ${payload.durasi} jam
💰 Subtotal: ${toIDR(payload.subtotal)}
🎟️ Diskon: ${toIDR(payload.discount)}
💵 Total: ${toIDR(payload.total)}
📄 Status Pembayaran: ${payload.paymentStatus || "Pending"}
📝 Catatan: ${payload.catatan || "-"}

Terima kasih 
    `.trim();

    // === Buka WhatsApp di tab baru ===
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  // === SEND TO WHATSAPP (user-triggered) ===
  const sendToWhatsApp = () => {
    const room = rooms.find((r) => r.id === selectedRoom);
    const message = `
Halo Admin VoxProHub! 🙌

Saya ingin melakukan booking dengan detail berikut:

🧍 Nama: ${name || "-"}
📞 No. HP: ${phone || "-"}
🏢 Ruangan: ${room ? room.name : "-"}
📅 Tanggal: ${selectedDate.join(", ") || "-"}
⏰ Jam: ${selectedTime.join(", ") || "-"}
⏳ Durasi: ${duration} jam
💰 Total: ${toIDR(total)}

Catatan: ${note || "-"}

Status: ${paymentStatus === "paid" ? "Sudah Bayar" : "Belum Bayar (via QRIS)"}
Terima kasih 🙏
      `;
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  const cancelQrisPayment = () => {
    if (paymentStatus === "paid") {
      // if paid, allow refund simulation
      setPaymentStatus("cancelled");
      showToast("info", "Pembayaran dibatalkan (simulasi).");
    } else {
      setPaymentStatus("cancelled");
      showToast("info", "Pembayaran dibatalkan (simulasi).");
    }
  };

  const simulateScanAndPay = async () => {
    if (!selectedRoom || selections.length === 0 || !phone) {
      showToast("error", "Lengkapi data booking sebelum melakukan pembayaran QRIS.");
      return;
    }

    setPaymentStatus("paid");
    setPaymentDeadline(null);
    showToast("success", "Pembayaran QRIS berhasil (simulasi). Status: paid.");

    // OPTIONAL: kirim ke backend
    if (lastBookingId) {
      try {
        await fetch(`http://localhost:5000/api/bookings/${lastBookingId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentStatus: "paid" }),
        });
      } catch (e) {
        console.error("Gagal update status ke paid:", e);
      }
    }
  };

  const handleConfirmAndCreateBooking = async () => {
    if (!selectedRoom || selections.length === 0 || !phone) {
      showToast("error", "Lengkapi data (ruangan, slot & nomor HP) sebelum pesan.");
      return;
    }

    const firstSlot = selections[0];

    const payload = {
      nama: name,
      telepon: phone,
      ruangan: selectedRoom,
      tanggal: firstSlot?.date || null,
      jam_mulai: firstSlot ? `${String(firstSlot.startHour).padStart(2, "0")}:00` : null,
      durasi: firstSlot?.duration || 1,
      slots: selections.map((s) => ({
        date: s.date,
        startHour: s.startHour,
        duration: s.duration,
        roomId: s.roomId,
        roomName: s.roomName,
      })),

      subtotal,
      discount: discountAmount,
      total,
      paymentStatus: "pending",
    };

    try {
      // 1) SIMPAN BOOKING KE SERVER
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      console.log("RESP /api/bookings:", data);

      // === CEK RESPONSE ERROR DULU ===
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Gagal membuat booking di server.");
      }

      // === COBA AMBIL bookingId DARI BERBAGAI BENTUK ===
      const bookingId = data.bookingId || data.id || data.booking?.id || null;

      // Kalau server tidak kirim bookingId, JANGAN lanjut ke QRIS
      if (!bookingId) {
        showToast("error", "Server tidak mengirim bookingId, tidak bisa lanjut ke pembayaran.");
        return;
      }

      // 2) GENERATE QRIS KE BACKEND
      const qrisRes = await fetch("http://localhost:5000/api/payments/qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount: total,
          deskripsi: `Booking Voxpro Hub #${bookingId}`,
        }),
      });

      const qrisData = await qrisRes.json().catch(() => null);
      console.log("RESP /api/payments/qris:", qrisData);

      if (!qrisRes.ok || !qrisData?.success) {
        throw new Error(qrisData?.message || "Gagal generate QRIS.");
      }

      const deadline = new Date(Date.now() + 15 * 60 * 1000);

      setShowConfirmModal(false);

      navigate(`/payment/${bookingId}`, {
        state: {
          bookingId,
          selections,
          total,
          subtotal,
          discountAmount,
          name,
          phone,
          room: rooms.find((r) => r.id === selectedRoom) || null,
          paymentDeadline: deadline.toISOString(),
          qris: {
            referenceId: qrisData.referenceId,
            qrData: qrisData.qrData,
            amount: qrisData.amount,
          },
        },
      });
    } catch (err) {
      console.error("❌ handleConfirmAndCreateBooking error:", err);
      showToast("error", err.message || "Gagal membuat booking. Cek console / Network tab.");
    }
  };

  // === AI AGENT (LOCAL SIMULATION) ===
  const aiGenerate = async (queryText) => {
    setAiLoading(true);
    const q = String(queryText || "")
      .trim()
      .toLowerCase();

    // simple hard-coded parsing rules:
    let reply = "Maaf, saya belum mengerti. Coba: 'jam buka', 'jam tutup', 'harga POD', 'kapasitas MEET', 'apply promo hemat50', 'cari slot kosong 2025-11-24 durasi 2', 'batalkan booking 123', 'summary'.";
    try {
      if (q.includes("jam buka") || q.includes("open hour") || q.includes("buka")) {
        reply = `Jam buka: ${OPEN_HOUR}:00, Jam tutup: ${CLOSE_HOUR}:00.`;
      } else if (q.includes("jam tutup") || q.includes("close")) {
        reply = `Jam tutup: ${CLOSE_HOUR}:00.`;
      } else if (q.startsWith("harga") || q.includes("harga ruang") || q.includes("price")) {
        // expect room code or name
        const found = rooms.find((r) => q.includes(r.id.toLowerCase()) || q.includes(r.name.toLowerCase()));
        if (found) reply = `${found.name} — ${toIDR(found.price)}/jam (kapasitas ${found.capacity}).`;
        else reply = "Sebutkan kode ruangan (POD/MEET/KRJ/STD) untuk melihat harga.";
      } else if (q.includes("kapasitas") || q.includes("capacity")) {
        const found = rooms.find((r) => q.includes(r.id.toLowerCase()) || q.includes(r.name.toLowerCase()));
        if (found) reply = `${found.name} memiliki kapasitas hingga ${found.capacity} orang.`;
        else reply = "Sebutkan kode ruangan untuk mengetahui kapasitas (contoh: 'kapasitas MEET').";
      } else if (q.startsWith("apply promo") || q.includes("apply promo") || q.includes("pakai promo")) {
        const code = q.split(" ").pop();
        if (PROMOS[code]) {
          applyPromo(code);
          reply = `Promo '${code}' diterapkan (${Math.round(PROMOS[code] * 100)}% off).`;
        } else {
          reply = `Kode promo '${code}' tidak ditemukan.`;
        }
      } else if (q.startsWith("cari slot kosong") || q.includes("slot kosong") || q.includes("find slots")) {
        // naive: expect 'cari slot kosong YYYY-MM-DD durasi N'
        const parts = q.split(" ");
        const dateCandidate = parts.find((p) => /^\d{4}-\d{2}-\d{2}$/.test(p));
        const durCandidate = parts.find((p, i) => parts[i - 1] === "durasi" || parts[i - 1] === "duration");
        const durNum = durCandidate ? parseInt(durCandidate) : duration;

        if (!dateCandidate) {
          // search multiple dates using selectedDate
          const datesToCheck = selectedDate.length ? selectedDate : [new Date().toISOString().split("T")[0]];
          const resSlots = [];
          for (const d of datesToCheck) {
            for (const r of rooms) {
              for (let h = OPEN_HOUR; h <= CLOSE_HOUR - durNum; h++) {
                if (!isSlotBlocked(r.id, d, h, durNum)) {
                  resSlots.push({ roomId: r.id, roomName: r.name, date: d, start: `${pad2(h)}:00`, duration: durNum });
                }
              }
            }
          }
          reply = `Menemukan ${resSlots.length} slot kosong. Menampilkan 5 teratas:`;
          const sample = resSlots
            .slice(0, 5)
            .map((s) => `${s.roomName} — ${s.date} ${s.start} (durasi ${s.duration}h)`)
            .join("\n");
          reply = reply + "\n\n" + sample;
        } else {
          // look for that date
          const resSlots = [];
          for (const r of rooms) {
            for (let h = OPEN_HOUR; h <= CLOSE_HOUR - durNum; h++) {
              if (!isSlotBlocked(r.id, dateCandidate, h, durNum)) {
                resSlots.push({ roomId: r.id, roomName: r.name, date: dateCandidate, start: `${pad2(h)}:00`, duration: durNum });
              }
            }
          }
          if (resSlots.length === 0) reply = `Tidak ditemukan slot kosong pada ${dateCandidate} untuk durasi ${durNum} jam.`;
          else {
            reply =
              `Menemukan ${resSlots.length} slot kosong pada ${dateCandidate} — menampilkan 5 teratas:\n` +
              resSlots
                .slice(0, 5)
                .map((s) => `${s.roomName} — ${s.start}`)
                .join("\n");
          }
        }
      } else if (q.startsWith("batalkan booking") || q.includes("cancel booking") || q.includes("batalkan")) {
        // simulate cancellation locally
        const idMatch = q.match(/\d+/);
        const id = idMatch ? idMatch[0] : null;
        if (!id) {
          reply = "Sebutkan ID booking untuk dibatalkan (contoh: 'batalkan booking 123').";
        } else {
          // remove from blockedSlots if bookingId matches or local simulated
          const prevLen = blockedSlots.length;
          const filtered = blockedSlots.filter((b) => String(b.bookingId) !== String(id));
          setBlockedSlots(filtered);
          if (filtered.length < prevLen) {
            reply = `Booking ID ${id} dibatalkan (simulasi lokal). Ruangan dikembalikan ke ketersediaan.`;
            showToast("success", `Booking ${id} dibatalkan (simulasi).`);
          } else {
            reply = `Booking ID ${id} tidak ditemukan pada data lokal.`;
          }
        }
      } else if (q.includes("summary") || q.includes("ringkasan") || q.includes("form")) {
        // show quick summary of current form
        const room = rooms.find((r) => r.id === selectedRoom);
        reply = `Ringkasan:
Nama: ${name || "-"}
Telepon: ${phone || "-"}
Ruangan: ${room ? room.name : "-"}
Tanggal: ${selectedDate.length ? selectedDate.join(", ") : "-"}
Jam: ${selectedTime.length ? selectedTime.join(", ") : "-"}
Durasi: ${duration} jam
Subtotal: ${toIDR(subtotal)}
Diskon: ${appliedPromo ? `${appliedPromo.code} (${Math.round(appliedPromo.discount * 100)}%)` : "-"}
Total: ${toIDR(total)}
Status Pembayaran: ${paymentStatus}
        `;
      }
    } catch (err) {
      console.error("AI error:", err);
      reply = "Terjadi error saat memproses permintaan AI (lihat console).";
    } finally {
      setAiLog((l) => [{ query: queryText, reply }, ...l].slice(0, 10));
      setAiLoading(false);
      setAiInput("");
      setAiOpen(true);
    }
  };

  // small helper: quick book preview accept suggestion
  const acceptSuggestion = (roomId) => {
    setSelectedRoom(roomId);
    setPreviewOpen(false);
    showToast("success", `Rekomendasi diterapkan: ${roomId}`);
  };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const selectedStartHour = selectedTime ? parseInt(selectedTime.split(":")[0], 10) : null;

  const maxDuration = selectedStartHour == null ? 12 : Math.max(1, CLOSE_HOUR - selectedStartHour);

  const durationOptions = [];
  for (let d = 1; d <= maxDuration; d++) {
    durationOptions.push(d);
  }

  useEffect(() => {
    if (selectedStartHour != null && duration > maxDuration) {
      setDuration(maxDuration);
    }
  }, [selectedStartHour, maxDuration]);

  useEffect(() => {
    if (!paymentDeadline || paymentStatus !== "pending") return;

    const timer = setInterval(async () => {
      const now = Date.now();

      if (now >= paymentDeadline) {
        clearInterval(timer);
        setPaymentDeadline(null);
        setShowPayment(false);
        setPaymentStatus("cancelled");
        showToast("info", "Waktu pembayaran habis. Booking dibatalkan otomatis.");

        setBlockedSlots((prev) => prev.filter((b) => !selections.some((s) => s.roomId === b.roomId && s.date === b.date && b.start === s.startHour && b.end === s.startHour + s.duration)));

        if (lastBookingId) {
          try {
            await fetch(`http://localhost:5000/api/bookings/${lastBookingId}/status`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentStatus: "cancelled" }),
            });
          } catch (e) {
            console.error("Gagal update status ke cancelled:", e);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentDeadline, paymentStatus, selections, lastBookingId]);

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] text-gray-800 overflow-x-hidden transition-colors duration-500">
      {/* === NAVBAR === */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scroll ? "bg-[#0d1224]/95 shadow-md backdrop-blur-md py-2" : "bg-white/90 py-4"} border-b ${scroll ? "border-[#0d1224]/40" : "border-gray-200/30"}`}>
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
            {[
              { name: "Beranda", path: "/" },
              // { name: "Booking", path: "/booking" },
              // { name: "Fasilitas", path: "/fasilitas" },
              // { name: "Kontak", path: "/kontak" },
            ].map((item, i) => (
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
          <button className="md:hidden" onClick={() => setOpen(!open)}>
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
              { name: "Fasilitas", path: "/fasilitas" },
              { name: "Kontak", path: "/kontak" },
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

      {/* MAIN */}
      <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-6 border border-gray-100 md:col-span-2">
          <h2 className="text-3xl font-bold text-center text-black mb-6">Pemesanan Ruangan</h2>

          {/* Pilih Ruangan */}
          <div>
            <label className="block font-reguler mb-2">Pilih Ruangan:</label>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500">
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({toIDR(r.price)}/jam) — Kapasitas {r.capacity}
                </option>
              ))}
            </select>
          </div>

          {/* Nama & Telepon */}
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500" />
            <input type="text" placeholder="Nomor Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} className="border rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500" />
          </div>

          {/* Kalender */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <button onClick={prevMonth} className="text-emerald-700 font-bold">
                &lt;
              </button>
              <h3 className="font-semibold">
                {monthNames[month]} {year}
              </h3>
              <button onClick={nextMonth} className="text-emerald-700 font-bold">
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => (
                <button
                  key={d.date}
                  disabled={d.past}
                  onClick={() => toggleDate(d.date)}
                  className={`rounded-lg py-2 text-sm font-medium transition-all
                    ${
                      d.past
                        ? "bg-gray-200 text-gray-500"
                        : selectedDate.includes(d.date)
                        ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                        : d.hasBooking
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Jam */}
          <div>
            <label className="block font-semibold mb-2">Pilih Jam:</label>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((t) => {
                const startH = parseInt(t.split(":")[0], 10);
                const blocked = selectedDate && isSlotBlocked(selectedRoom, selectedDate, startH, duration);

                return (
                  <button
                    key={t}
                    onClick={() => toggleTime(t)}
                    disabled={blocked}
                    className={`
        py-2 rounded-lg border flex items-center justify-center gap-1
        ${selectedTime.includes(t) ? "bg-emerald-600 text-white border-emerald-700" : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-100"}
        ${blocked ? "opacity-60 cursor-not-allowed line-through" : ""}
      `}
                  >
                    {selectedTime.includes(t) && "✅"} {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Durasi */}
          <div>
            <label className="block font-semibold mb-2">Durasi (jam):</label>

            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={!selectedTime}
              className="border rounded-xl p-3 w-32 text-center focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              {!selectedTime && <option value={1}>1</option>}

              {selectedTime &&
                durationOptions.map((d) => (
                  <option key={d} value={d}>
                    {d} jam
                  </option>
                ))}
            </select>

            {selectedTime.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                Maksimal {maxDuration} jam untuk jam mulai {selectedTime[0]} (tutup {CLOSE_HOUR}:00).
              </p>
            )}
          </div>

          {/* PROMO SECTION (input + tombol + pakai promo tersedia) */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">Kode Promo</label>

            <div className="grid grid-cols-3 gap-3">
              {/* Input kode */}
              <input type="text" placeholder="Masukkan Kode Promo Kamu" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="col-span-2 border rounded-xl px-4 h-11 text-sm focus:ring-2 focus:ring-emerald-500" />

              {/* Terapkan */}
              <button type="button" onClick={() => applyPromo(promoCode)} className="h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
                Terapkan
              </button>

              {/* Pakai promo yang tersedia */}
              <button type="button" onClick={() => setPromoListOpen(true)} className="col-span-2 h-11 rounded-xl bg-amber-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-amber-600 transition">
                <span className="text-lg">🎫</span>
                Pakai Promo Yang Tersedia
              </button>

              {/* Bersihkan */}
              <button
                type="button"
                onClick={() => {
                  setAppliedPromo(null);
                  setPromoCode("");
                  showToast("info", "Promo dibersihkan.");
                }}
                className="h-11 rounded-xl bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition"
              >
                Bersihkan
              </button>
            </div>
          </div>

          {/* Ringkasan */}
          {/* <div className="p-4 bg-gray-50 border rounded-xl">
            <p className="font-semibold mb-2 text-gray-700">Ringkasan Booking:</p>
            <p>Ruangan: {selectedRoom || "-"}</p>
            <p>Tanggal: {selectedDate.join(", ") || "-"}</p>
            <p>Jam: {selectedTime.join(", ") || "-"}</p>
            <p>Durasi: {duration} jam</p>
            <p>Subtotal: {toIDR(subtotal)}</p>
            <p>Diskon: {appliedPromo ? `${appliedPromo.code} (${Math.round(appliedPromo.discount * 100)}%) - ${toIDR(discountAmount)}` : "-"}</p>
            <p className="font-semibold text-emerald-700 mt-2">Total: {toIDR(total)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Status Pembayaran: <span className={`font-semibold ${paymentStatus === "paid" ? "text-green-600" : paymentStatus === "cancelled" ? "text-red-600" : "text-amber-600"}`}>{paymentStatus}</span>
            </p>
          </div> */}

          {/* Tombol aksi */}
          <div className="grid md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={addSelection}
              disabled={!selectedRoom || !selectedDate || !selectedTime}
              className="
                          bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition
                          cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                        "
            >
              Tambah ke Daftar
            </button>
            <button onClick={handleSubmitBooking} disabled={!selectedRoom || !phone || selectedDate.length === 0} className="bg-emerald-600 cursor-pointer text-white py-3 rounded-xl hover:bg-emerald-700 transition">
              Simpan Booking
            </button>
            <button onClick={sendToWhatsApp} className="bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition">
              Chat via WhatsApp
            </button>
            <button onClick={generateRecommendations} className="bg-sky-600 text-white py-3 rounded-xl hover:bg-sky-700 transition">
              Preview Rekomendasi Ruangan
            </button>
            <button onClick={() => setAiOpen(true)} className="bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 transition">
              Bantuan AI Agent
            </button>
          </div>
        </div>

        {/* RINGKASAN + PEMBAYARAN */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Ringkasan & Pembayaran</h3>

          <div className="border border-orange-100 bg-orange-50 rounded-2xl p-4 mb-4 text-sm">
            {selections.length === 0 ? (
              <p className="text-gray-500">
                Belum ada pilihan. Pilih ruangan, tanggal & jam di kiri lalu klik <b>Tambah ke Daftar</b>.
              </p>
            ) : (
              <ul className="space-y-3">
                {selections.map((s, idx) => {
                  const endH = Math.min(CLOSE_HOUR, s.startHour + s.duration);
                  return (
                    <li key={`${s.roomId}-${s.date}-${s.time}-${idx}`} className="bg-white border border-orange-100 rounded-2xl px-3 py-3 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{s.roomName}</div>
                        <div className="text-gray-700 text-xs">{formatLongDate(s.date)}</div>
                        <div className="text-gray-700 text-xs">
                          {pad2(s.startHour)}:00–{pad2(endH)}:00 • {s.duration} jam
                        </div>
                      </div>

                      <button onClick={() => removeSelection(idx)} className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="text-gray-700 mb-4 bg-orange-50 rounded-xl p-3 shadow-sm text-xs">
            <p className="mt-1">
              Total Booking: <b>{selections.length} Slot</b>
            </p>
            <p className="mt-1">
              Estimasi Total: <b>{toIDR(total)}</b>
            </p>

            {/* Progress hemat promo */}
            {subtotal > 0 && (
              <div className="mt-3">
                <div className="flex justify-between items-center text-[11px] text-gray-600 mb-1">
                  <span>Kamu hemat</span>
                  <span className="font-semibold text-emerald-700">
                    {toIDR(discountAmount)} {discountAmount > 0 ? `(${savingsPercent}%)` : ""}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500" style={{ width: `${Math.min(100, savingsPercent || 0)}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Tombol lanjut ke pembayaran */}
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={!selectedRoom || selections.length === 0 || !phone}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Pesan Sekarang
          </button>

          {/* {!showPayment && selections.length > 0 && (
            <button
              onClick={openConfirmModal}
              className="w-full mb-4 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!selectedRoom || !phone} // opsional: tetap kelihatan tapi nonaktif kalau belum isi room/HP
            >
              Pesan Sekarang
            </button>
          )} */}

          {/* Panel QRIS hanya tampil kalau showPayment = true */}
          {/* {showPayment && (
            <div className="text-center border-t border-gray-100 pt-4">
              <h4 className="font-semibold text-base mb-2 text-gray-800">Pembayaran QRIS</h4>
              <img src={qrisImage} alt="QRIS Payment" className="w-48 h-48 mx-auto mb-3 rounded-2xl border shadow-sm" />
              <p className="text-xs text-gray-600 leading-relaxed">Silakan lakukan pembayaran melalui QRIS untuk mempercepat konfirmasi.</p>
              <p className="text-[11px] text-gray-500 mt-1 italic">
                Setelah pembayaran, status akan berubah menjadi <span className="font-semibold">paid</span> (simulasi).
              </p>

              <div className="mt-3 space-y-2">
                <button onClick={simulateScanAndPay} className="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition text-sm">
                  Scan &amp; Bayar (Simulasi)
                </button>
                <button onClick={cancelQrisPayment} className="w-full bg-red-400 text-white py-2 rounded-xl hover:bg-red-500 transition text-sm">
                  Batalkan Pembayaran
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`fixed right-6 bottom-6 z-60 px-5 py-3 rounded-lg shadow-lg ${toast.type === "success" ? "bg-green-600 text-white" : toast.type === "error" ? "bg-red-600 text-white" : "bg-amber-500 text-black"}`}>
          {toast.message}
        </div>
      )}

      {/* PREVIEW SUGGESTIONS MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h3 className="font-semibold text-lg mb-3">Rekomendasi Ruangan</h3>
            {previewSuggestions.length === 0 ? (
              <p>Tidak ada rekomendasi yang tersedia untuk pilihan Anda.</p>
            ) : (
              <div className="grid gap-3">
                {previewSuggestions.map((s) => (
                  <div key={s.id} className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold">
                        {s.name} — {s.capacity} orang
                      </div>
                      <div className="text-sm text-gray-600">{s.desc}</div>
                      <div className="text-sm mt-1">
                        Estimasi biaya: <span className="font-semibold">{toIDR(s.estCost)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => acceptSuggestion(s.id)} className="bg-emerald-600 text-white py-2 px-4 rounded-xl">
                        Pakai
                      </button>
                      <div className="text-xs text-gray-500">Tersedia</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-right">
              <button onClick={() => setPreviewOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI AGENT MODAL */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-semibold text-lg">AI Agent — Bantuan Pintar</h3>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setAiOpen(false);
                  }}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Tanyakan sesuatu, contoh: 'jam buka', 'harga POD', 'apply promo hemat50', 'cari slot kosong 2025-11-24 durasi 2'"
                className="col-span-3 border rounded-xl p-3"
              />
              <button onClick={() => aiGenerate(aiInput)} disabled={aiLoading} className="col-span-1 bg-emerald-600 text-white rounded-xl p-3">
                {aiLoading ? "Memproses..." : "Kirim"}
              </button>
            </div>

            <div className="mt-4 max-h-64 overflow-auto space-y-3">
              {aiLog.length === 0 ? (
                <div className="text-sm text-gray-500">Riwayat percakapan AI akan muncul di sini...</div>
              ) : (
                aiLog.map((l, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="text-xs text-gray-500">Anda: {l.query}</div>
                    <div className="mt-2 whitespace-pre-line">{l.reply}</div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  setAiLog([]);
                  showToast("info", "Riwayat AI dibersihkan.");
                }}
                className="px-3 py-2 rounded bg-gray-200 mr-2"
              >
                Bersihkan Riwayat
              </button>
              <button onClick={() => setAiOpen(false)} className="px-4 py-2 rounded bg-emerald-600 text-white">
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP LIST PROMO YANG TERSEDIA */}
      {promoListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">Promo yang Tersedia</h3>
              <button onClick={() => setPromoListOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">Pilih salah satu promo di bawah untuk langsung digunakan.</p>

            <ul className="space-y-3 text-sm">
              {Object.entries(PROMOS).map(([code, discount]) => (
                <li
                  key={code}
                  className="
              border border-gray-200 rounded-xl p-3 
              flex items-center justify-between
              hover:border-emerald-500 hover:bg-emerald-50 transition
            "
                >
                  <div>
                    <div className="font-semibold text-gray-800 uppercase tracking-wide">{code}</div>
                    <div className="text-gray-600 text-xs">Diskon {Math.round(discount * 100)}% • Berlaku untuk semua ruangan</div>
                  </div>
                  <button
                    onClick={() => {
                      applyPromo(code);
                      setPromoListOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                  >
                    Pakai
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-right">
              <button onClick={() => setPromoListOpen(false)} className="text-xs text-gray-500 hover:text-gray-700">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP KONFIRMASI PESANAN */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 relative">
            {/* Icon centang */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <svg className="w-9 h-9 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Buat Pesanan</h3>
              <p className="text-xs text-gray-500 mt-1">Pastikan data dan jadwal yang kamu pilih sudah benar sebelum melanjutkan.</p>
            </div>

            {/* Detail utama */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-xs text-gray-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium">{name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">No. HP</span>
                <span className="font-medium">{phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Slot</span>
                <span className="font-medium">{selections.length} slot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Pembayaran</span>
                <span className="font-semibold text-emerald-700">{toIDR(total)}</span>
              </div>
            </div>

            {/* List slot */}
            <div className="max-h-40 overflow-auto mb-4 space-y-2">
              {selections.map((s, idx) => {
                const endH = Math.min(CLOSE_HOUR, s.startHour + s.duration);
                return (
                  <div key={`${s.roomId}-${s.date}-${s.time}-${idx}`} className="border border-gray-100 rounded-2xl px-3 py-2 text-xs flex justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{s.roomName}</div>
                      <div className="text-gray-600">{formatLongDate(s.date)}</div>
                      <div className="text-gray-700">
                        {pad2(s.startHour)}:00–{pad2(endH)}:00 • {s.duration} jam
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tombol */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowConfirmModal(false)} // ✅ pakai ini
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                Batalkan
              </button>

              <button onClick={handleConfirmAndCreateBooking} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition cursor-pointer">
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === FOOTER === */}
      <footer className="bg-[#0d1224] text-gray-300 pt-12 pb-8 px-6 md:px-20 relative overflow-hidden">
        {/* Top Gradient Line */}
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

        {/* Bottom Copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} <span className="text-white font-semibold">Voxpro Hub</span> — Crafted with voxprohub Makassar
          </p>
        </div>
      </footer>
    </div>
  );
}
