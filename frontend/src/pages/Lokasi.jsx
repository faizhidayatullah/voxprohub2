import React from "react";

export default function LokasiDanFooter() {
  return (
    <div className="w-full">
      {/* === LOKASI / MAPS === */}
      <section className="bg-orange-50 py-10 px-6 md:px-16 grid md:grid-cols-2 gap-8 items-center">
        {/* Peta */}
        <div className="w-full h-72 rounded-2xl shadow-lg overflow-hidden">
          <iframe
            title="Lokasi Voxpro Hub"
            src="https://www.google.com/maps?q=Kedai%20Mantao%20Makassar&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Deskripsi */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">Lokasi Ruangan</h2>
          <p className="text-gray-700 mt-2">
            Terletak di kawasan strategis dengan akses mudah, parkir luas,
            serta dikelilingi kafe dan ATM.
          </p>
          <a
            href="https://www.google.com/maps/place/Kedai+Mantao+Makassar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-medium underline hover:text-orange-800"
          >
            Buka di Google Maps →
          </a>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-gray-100 text-gray-700 text-center py-6 mt-12 rounded-t-2xl">
        <h2 className="text-lg font-semibold text-orange-700">VOXPRO HUB</h2>
        <p className="text-sm mt-1">
          Ruang untuk berkreasi, berinovasi, dan berkolaborasi.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} VoxPro Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
