import pool from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    console.log("DEBUG: createBooking kepanggil");
    const { nama, telepon, ruangan, tanggal, jam_mulai, durasi, catatan, subtotal, discount, total, paymentStatus, slots } = req.body;

    let mainDate = tanggal || null;
    let mainStart = jam_mulai || null;
    let mainDuration = durasi || 1;

    if ((!mainDate || !mainStart) && Array.isArray(slots) && slots.length > 0) {
      const first = slots[0];
      mainDate = first.date || null;

      if (first.startHour != null) {
        const hh = String(first.startHour).padStart(2, "0");
        mainStart = `${hh}:00`;
      }

      mainDuration = first.duration || 1;
    }

    const [result] = await pool.query(
      `INSERT INTO bookings 
       (nama, telepon, ruangan, tanggal, jam_mulai, durasi, catatan, subtotal, discount, total, paymentStatus, slots_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        telepon,
        ruangan,
        Array.isArray(mainDate) ? JSON.stringify(mainDate) : mainDate,
        mainStart,
        mainDuration,
        catatan || "",
        subtotal || 0,
        discount || 0,
        total || 0,
        paymentStatus || "pending",
        slots ? JSON.stringify(slots) : null,
      ]
    );

    const newId = result.insertId;

    // 🔥 INI yang frontend kamu butuhkan
    return res.json({
      success: true,
      bookingId: newId,
      booking: {
        id: newId,
        nama,
        telepon,
        ruangan,
        tanggal: mainDate,
        jam_mulai: mainStart,
        durasi: mainDuration,
        catatan,
        subtotal,
        discount,
        total,
        paymentStatus: paymentStatus || "pending",
      },
    });
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan booking" });
  }
};

export const getBookings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bookings ORDER BY tanggal DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Gagal mengambil booking:", err);
    res.status(500).json({ message: "Gagal mengambil booking" });
  }
};

export const getBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT id, paymentStatus FROM bookings WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking tidak ditemukan",
      });
    }

    // rows[0] mis: { id: 141, paymentStatus: 'paid' }
    return res.json({
      success: true,
      booking: rows[0],
    });
  } catch (err) {
    console.error("GET /api/bookings/:id/status error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil status pembayaran",
    });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { nama, telepon, ruangan, tanggal, jam_mulai, durasi, detail, catatan, status } = req.body;

  try {
    await pool.query(
      `UPDATE bookings 
       SET nama=?, telepon=?, ruangan=?, tanggal=?, jam_mulai=?, durasi=?, detail=?, catatan=?
       WHERE id=?`,
      [nama, telepon, ruangan, tanggal, jam_mulai, durasi, detail, catatan, id]
    );

    res.json({ success: true, message: "Booking berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Gagal memperbarui booking" });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM bookings WHERE id=?", [id]);
    res.json({ success: true, message: "Booking berhasil dihapus" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Gagal menghapus booking" });
  }
};
