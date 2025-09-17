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

  const MATCH_HEIGHT = 100 // Tinggi minimum untuk satu match card
  const MATCH_WIDTH = 200 // Lebar card yang lebih kecil
  const CARD_MARGIN = 40 // Jarak antara card dan garis
  const ROUND_GAP = 320 // Jarak antar round yang lebih besar
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
    <div className="w-full overflow-x-auto py-12 bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d]">
      <div className="max-w-md mx-auto mb-8 flex flex-col gap-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search players..."
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-[#1a1a1d] text-gray-200 focus:outline-none focus:ring focus:ring-primary"
        />
        <div className="flex gap-2 justify-center">
          <button
            className="px-3 py-1 rounded bg-gray-800 text-gray-200 font-semibold hover:bg-gray-700"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            aria-label="Zoom Out"
          >
            -
          </button>
          <span className="px-2 text-sm font-medium text-gray-200">Zoom: {(zoom * 100).toFixed(0)}%</span>
          <button
            className="px-3 py-1 rounded bg-gray-800 text-gray-200 font-semibold hover:bg-gray-700"
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
          
          // Perhitungan spacing yang lebih presisi untuk tiap round
          const baseSpacing = MATCH_HEIGHT + 40 // Spacing dasar untuk round pertama
          const roundMultiplier = round === 1 ? 1 : Math.pow(2, round - 1)
          const spacing = baseSpacing * roundMultiplier
          
          // Hitung total height berdasarkan jumlah match di round ini
          const totalHeight = Math.max(
            matches.length * spacing,
            round > 1 ? getRoundMatches(round - 1).length * (baseSpacing * Math.pow(2, round - 2)) : 0
          )

          return (
            <div key={round} className="flex flex-col relative">
              {/* Header round */}
              <div className="text-sm font-semibold mb-6 text-gray-400 uppercase tracking-wide text-center">
                {getRoundName(round)}
              </div>

              {/* Container matches */}
              <div className="relative" style={{ minHeight: `${totalHeight}px` }}>
                {/* Connector lines */}
                {round < tournament.totalRounds && matches.map((match, index) => {
                  const yPos = round === 1 
                    ? index * spacing
                    : (index * 2 + 1) * (spacing / 2) - (MATCH_HEIGHT / 2)
                  const nextMatchYPos = Math.floor(index / 2) * (spacing * 2)
                  const isEvenMatch = index % 2 === 0
                  
                  return (
                    <svg
                      key={`connector-${match.id}`}
                      className="absolute"
                      style={{ 
                        left: MATCH_WIDTH, 
                        top: yPos + MATCH_HEIGHT/2,
                        height: isEvenMatch ? spacing : spacing/2,
                        width: ROUND_GAP - MATCH_WIDTH/4,
                        zIndex: 0,
                        overflow: 'visible'
                      }}
                    >
                      {/* Horizontal line from card */}
                      <line 
                        x1="0" 
                        y1="0" 
                        x2={ROUND_GAP/2 - 20} 
                        y2="0" 
                        stroke="#444" 
                        strokeWidth="2"
                      />
                      
                      {/* Vertical connector */}
                      {isEvenMatch ? (
                        <line 
                          x1={ROUND_GAP/2 - 20} 
                          y1="0" 
                          x2={ROUND_GAP/2 - 20} 
                          y2={spacing} 
                          stroke="#444" 
                          strokeWidth="2"
                        />
                      ) : (
                        <line 
                          x1={ROUND_GAP/2 - 20} 
                          y1="0" 
                          x2={ROUND_GAP/2 - 20} 
                          y2={-spacing/2} 
                          stroke="#444" 
                          strokeWidth="2"
                        />
                      )}
                      
                      {/* Horizontal line to next round (only for odd index) */}
                      {!isEvenMatch && (
                        <line 
                          x1={ROUND_GAP/2 - 20} 
                          y1={-spacing/2} 
                          x2={ROUND_GAP - 150} 
                          y2={-spacing/2} 
                          stroke="#444" 
                          strokeWidth="2"
                        />
                      )}
                    </svg>
                  )
                })}

                {/* Match cards */}
                {matches.map((match, index) => {
                  // Kalkulasi posisi yang lebih presisi
                  const yPos = round === 1 
                    ? index * spacing
                    : (index * 2 + 1) * (spacing / 2) - (MATCH_HEIGHT / 2)
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