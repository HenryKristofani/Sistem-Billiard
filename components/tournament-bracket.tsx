"use client"
import type { Tournament } from "@/types/tournament"
import { useState } from "react"
import { MatchCard } from "./match-card"
import { updateMatchResult } from "@/lib/tournament-utils"

interface TournamentBracketProps {
  tournament: Tournament
  onTournamentUpdate: (tournament: Tournament) => void
}

export function TournamentBracket({ tournament, onTournamentUpdate }: TournamentBracketProps) {
  const [search, setSearch] = useState("")
  const [zoom, setZoom] = useState(1)

  const MATCH_HEIGHT = 140 // Tinggi minimum untuk satu match card
  const MATCH_WIDTH = 280 // Lebar card
  const CARD_MARGIN = 40 // Jarak antara card dan garis
  const ROUND_GAP = 200 // Jarak antar round yang lebih besar
  const CONNECTOR_LENGTH = 40 // Panjang garis horizontal

  const handleMatchUpdate = (matchId: string, winnerId: number, score1: number, score2: number) => {
    const updatedTournament = updateMatchResult(tournament, matchId, winnerId, score1, score2)
    onTournamentUpdate(updatedTournament)
  }

  const getRoundMatches = (round: number) => {
    return tournament.matches.filter((match) => match.round === round)
  }

  const getRoundName = (round: number) => {
    const totalRounds = tournament.totalRounds
    if (round === totalRounds) return "Final"
    if (round === totalRounds - 1) return "Semi-Final"
    if (round === totalRounds - 2) return "Quarter-Final"
    if (round === totalRounds - 3) return "Round of 16"
    if (round === totalRounds - 4) return "Round of 32"
    if (round === totalRounds - 5) return "Round of 64"
    return `Round ${round}`
  }

  // Filter function
  const matchContainsPlayer = (match: any, keyword: string) => {
    if (!keyword) return true
    const lower = keyword.toLowerCase()
    return (
      match.player1?.name?.toLowerCase().includes(lower) ||
      match.player2?.name?.toLowerCase().includes(lower)
    )
  }

  return (
    <div className="w-full overflow-x-auto py-12 bg-gray-50">
      <div className="max-w-md mx-auto mb-8 flex flex-col gap-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama pemain..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
        />
        <div className="flex gap-2 justify-center">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            aria-label="Zoom Out"
          >
            -
          </button>
          <span className="px-2 text-sm font-medium">Zoom: {(zoom * 100).toFixed(0)}%</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
            onClick={() => setZoom(z => Math.min(2, z + 0.1))}
            aria-label="Zoom In"
          >
            +
          </button>
        </div>
      </div>
      <div
        className="flex px-8 min-w-max"
        style={{ gap: `${ROUND_GAP}px`, transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}
      >
        {Array.from({ length: tournament.totalRounds }, (_, i) => i + 1).map((round) => {
          const matches = getRoundMatches(round).filter(m => matchContainsPlayer(m, search))
          const spacing = MATCH_HEIGHT * Math.pow(2, round - 1) + 40 // Tambah padding ekstra
          const totalHeight = matches.length * spacing

          return (
            <div key={round} className="flex flex-col relative">
              {/* Header round */}
              <div className="text-sm font-semibold mb-6 text-gray-600 uppercase tracking-wide text-center">
                {getRoundName(round)}
              </div>

              {/* Container matches */}
              <div className="relative" style={{ minHeight: `${totalHeight}px` }}>
                {/* Tidak ada garis penghubung antar bagan */}
                {/* Layer card di atas garis */}
                {matches.map((match, index) => {
                  const yPos = index * spacing + (spacing - MATCH_HEIGHT) / 2
                  return (
                    <div key={match.id}>
                      <div 
                        className="absolute left-0" 
                        style={{ top: `${yPos}px`, zIndex: 1 }}
                      >
                        <MatchCard match={match} onUpdateMatch={handleMatchUpdate} />
                      </div>
                     </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}