"use client"
import type { Tournament } from "@/types/tournament"
import { MatchCard } from "./match-card"
import { updateMatchResult } from "@/lib/tournament-utils"

interface TournamentBracketProps {
  tournament: Tournament
  onTournamentUpdate: (tournament: Tournament) => void
}

export function TournamentBracket({ tournament, onTournamentUpdate }: TournamentBracketProps) {
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

  const MATCH_HEIGHT = 100
  const MATCH_WIDTH = 280 // Lebar card
  const CARD_MARGIN = 40 // Jarak antara card dan garis
  const ROUND_GAP = 160 // Jarak antar round
  const CONNECTOR_LENGTH = 40 // Panjang garis horizontal

  return (
    <div className="w-full overflow-x-auto py-8 bg-gray-50">
      <div className="flex px-8 min-w-max" style={{ gap: `${ROUND_GAP}px` }}>
        {Array.from({ length: tournament.totalRounds }, (_, i) => i + 1).map((round) => {
          const matches = getRoundMatches(round)
          const spacing = MATCH_HEIGHT * Math.pow(2, round - 1)
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