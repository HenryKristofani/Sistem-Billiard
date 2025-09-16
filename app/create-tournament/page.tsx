"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const bracketOptions = [4, 8, 16, 32, 64, 128];

export default function CreateTournamentPage() {
  const [bracketSize, setBracketSize] = useState<number>(16);
  const [tournamentName, setTournamentName] = useState("");
  const [players, setPlayers] = useState<string[]>(Array(16).fill(""));
  const [handicaps, setHandicaps] = useState<(number|null)[]>(Array(16).fill(null));
  const [isSaved, setIsSaved] = useState(false);
  const [randomize, setRandomize] = useState(false);

  // Update player input fields when bracket size changes
  const handleBracketChange = (size: number) => {
    setBracketSize(size);
    setPlayers(Array(size).fill(""));
  };

  const handlePlayerChange = (idx: number, value: string) => {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleHandicapChange = (idx: number, value: number|null) => {
    setHandicaps((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  // Validasi nama peserta wajib diisi
  const allNamesFilled = players.every((name) => name.trim() !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] to-[#23272f] text-white py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-[#18181b] border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Tournament</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Tournament Name</label>
              <Input
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="Enter tournament name"
                className="bg-[#23272f] border-gray-700 text-white"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Bracket Size</label>
              <div className="flex flex-wrap gap-2">
                {bracketOptions.map((size) => (
                  <Button
                    key={size}
                    variant={bracketSize === size ? "default" : "outline"}
                    className={`px-4 py-2 text-sm ${bracketSize === size ? "bg-accent text-white" : "bg-[#23272f] border-gray-700 text-gray-200"}`}
                    onClick={() => handleBracketChange(size)}
                  >
                    {size} Players
                  </Button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Players ({bracketSize})</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {players.map((name, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      value={name}
                      onChange={(e) => handlePlayerChange(idx, e.target.value)}
                      placeholder={`Player ${idx + 1}`}
                      className="bg-[#23272f] border-gray-700 text-white"
                    />
                    <select
                      value={handicaps[idx] === null ? "" : handicaps[idx]}
                      onChange={e => {
                        if (e.target.value === "clear") {
                          handleHandicapChange(idx, null);
                        } else {
                          const val = e.target.value === "" ? null : Number(e.target.value);
                          handleHandicapChange(idx, val);
                        }
                      }}
                      className="bg-[#23272f] border border-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none"
                    >
                      <option value="" disabled hidden>HC</option>
                      {[3,4,5,6,7].map(hc => (
                        <option key={hc} value={hc}>{hc}</option>
                      ))}
                      <option value="clear">Clear</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button asChild variant="outline" className="bg-[#23272f] border-gray-700 text-gray-200">
                <Link href="/">Cancel</Link>
              </Button>
              <Button
                className="bg-accent text-white"
                disabled={!allNamesFilled}
                onClick={() => setIsSaved(true)}
              >
                Simpan
              </Button>
              <Button
                variant="outline"
                className="bg-[#23272f] border-gray-700 text-gray-200"
                onClick={() => setIsSaved(false)}
                disabled={!isSaved}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Drawing & Bracket Form muncul setelah Simpan */}
        {isSaved && (
          <div className="mt-8">
            <Card className="bg-[#18181b] border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Drawing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      type="button"
                      aria-pressed={randomize}
                      onClick={() => setRandomize((v) => !v)}
                      className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none ${randomize ? 'bg-green-700' : 'bg-[#23272f]'}`}
                      style={{ minWidth: '56px' }}
                    >
                      <span
                        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200"
                        style={{ transform: randomize ? 'translateX(24px)' : 'translateX(0)' }}
                      />
                    </button>
                    <span className="text-sm">Randomize Bracket</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-accent text-white">Create Bracket</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
