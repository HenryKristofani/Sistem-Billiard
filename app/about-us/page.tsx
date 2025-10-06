"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#18181b] text-gray-200 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-[#23232a] rounded-2xl shadow-lg p-8 border border-gray-700 flex flex-col items-center">
        <Trophy className="h-12 w-12 text-accent mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-white text-center">Tentang BilliardPro</h1>
        <p className="text-lg text-gray-300 mb-6 text-center">
          BilliardPro adalah platform turnamen biliar modern yang memudahkan penyelenggaraan, pencatatan skor, dan pelacakan jalannya kompetisi secara digital. Kami berkomitmen untuk memberikan pengalaman terbaik bagi komunitas biliar Indonesia.
        </p>
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2 text-accent">Fitur Utama</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Pembuatan & manajemen turnamen otomatis</li>
            <li>Pencatatan skor real-time & sistem handicap</li>
            <li>Bracket visual interaktif & responsif</li>
            <li>Statistik pemain & riwayat pertandingan</li>
            <li>Desain modern, mudah digunakan di HP & desktop</li>
          </ul>
        </div>
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2 text-accent">Misi Kami</h2>
          <p className="text-gray-300">
            Membantu komunitas biliar Indonesia berkembang dengan teknologi, transparansi, dan kemudahan akses informasi turnamen.
          </p>
        </div>
        <Link href="/" className="mt-4 inline-block px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent/80 transition">Kembali ke Beranda</Link>
      </div>
    </main>
  );
}
