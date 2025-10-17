"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#18181b] text-gray-200 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-[#23232a] rounded-2xl shadow-lg p-8 border border-gray-700 flex flex-col items-center">
        <Trophy className="h-12 w-12 text-accent mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-white text-center">About BilliardPro</h1>
        <p className="text-lg text-gray-300 mb-6 text-center">
          BilliardPro is a modern billiard tournament platform that simplifies organizing, scorekeeping, and tracking competitions digitally. We are committed to providing the best experience for the billiard community.
        </p>
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2 text-accent">Key Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Automatic tournament creation & management</li>
            <li>Real-time scorekeeping & handicap system</li>
            <li>Interactive & responsive visual brackets</li>
            <li>Player statistics & match history</li>
            <li>Modern design, easy to use on mobile & desktop</li>
          </ul>
        </div>
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2 text-accent">Our Mission</h2>
          <p className="text-gray-300">
            To help the billiard community grow with technology, transparency, and easy access to tournament information.
          </p>
        </div>
        <Link href="/" className="mt-4 inline-block px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent/80 transition">Back to Home</Link>
      </div>
    </main>
  );
}
