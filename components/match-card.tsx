"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import type { Match } from "@/types/tournament"
import { cn } from "@/lib/utils"

// Extend the Window interface to include 'toast'
declare global {
  interface Window {
    toast?: {
      error: (msg: string) => void
      [key: string]: any
    }
  }
}

interface MatchCardProps {
  match: Match
  onUpdateMatch: (matchId: string, winnerId: number, score1: number, score2: number) => void
  tournamentStatus?: string
  tournamentOwnerId?: string | null
  currentUserId?: string | null
}

export function MatchCard({ match, onUpdateMatch, tournamentStatus, tournamentOwnerId, currentUserId }: MatchCardProps) {
  const [score1, setScore1] = useState(match.score1?.toString() || "")
  const [score2, setScore2] = useState(match.score2?.toString() || "")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (winnerId: number) => {
    // First check if user is owner
    if (!currentUserId || !tournamentOwnerId || currentUserId !== tournamentOwnerId) {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Unauthorized: Only tournament owner can update scores')
      } else {
        alert('Unauthorized: Only tournament owner can update scores')
      }
      setIsOpen(false)
      return
    }

    // Check if tournament is ongoing
    if (tournamentStatus !== 'ongoing') {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Tournament not started')
      } else {
        alert('Tournament not started')
      }
      setIsOpen(false)
      return
    }

    const s1 = Number.parseInt(score1) || 0
    const s2 = Number.parseInt(score2) || 0
    
    // Validasi sederhana
    if (s1 < 0 || s2 < 0) {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Score tidak boleh negatif')
      } else {
        alert('Score tidak boleh negatif')
      }
      return
    }
    
    // Pastikan winner sesuai dengan skor tertinggi
    if ((winnerId === match.player1?.id && s1 <= s2) || 
        (winnerId === match.player2?.id && s2 <= s1)) {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Pemenang harus memiliki skor lebih tinggi')
      } else {
        alert('Pemenang harus memiliki skor lebih tinggi')
      }
      return
    }
    
    onUpdateMatch(match.id, winnerId, s1, s2)
    setIsOpen(false)
  }

  const canPlay = match.player1 && match.player2
  const isOwner = currentUserId && tournamentOwnerId && currentUserId === tournamentOwnerId
  const canSetScore = canPlay && !match.isCompleted && tournamentStatus === 'ongoing' && isOwner

  const handleSetScoreClick = () => {
    if (tournamentStatus !== 'ongoing') {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Turnamen belum dimulai')
      } else {
        alert('Turnamen belum dimulai')
      }
      return
    }
    if (!isOwner) {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Hanya owner turnamen yang dapat mengatur skor')
      } else {
        alert('Hanya owner turnamen yang dapat mengatur skor')
      }
      return
    }
    setIsOpen(true)
  }

  return (
    <div className="flex flex-col items-center">
      <Card
        className={cn(
          "w-48 h-20 transition-all duration-200 hover:shadow-md bg-[#1a1a1d] border-gray-700",
          match.isCompleted && "bg-primary/20 border-primary/50",
          !canPlay && "opacity-50",
        )}
      >
        <CardContent className="p-3 h-full flex flex-col items-center justify-center text-gray-200">
          <div className="flex flex-col items-center justify-center w-full h-full gap-2">
            {/* Player 1 Row */}
            <div className="flex items-center justify-between w-full border-b border-gray-600 pb-1">
              <span
                className={cn(
                  "text-sm font-medium flex-1 truncate pr-2",
                  match.winner?.id === match.player1?.id && "text-primary font-bold",
                )}
              >
                {match.player1 ? `${match.player1.name}${typeof match.player1.handicap === 'number' ? ` (${match.player1.handicap})` : ''}` : "TBD"}
              </span>
              {match.isCompleted && match.score1 !== undefined && (
                <span className={cn(
                  "text-sm font-bold w-6 text-center px-1 rounded",
                  Number(match.score1) > Number(match.score2) ? "bg-green-600 text-white" : "bg-red-600 text-white"
                )}>
                  {match.score1}
                </span>
              )}
            </div>
            {/* Player 2 Row */}
            <div className="flex items-center justify-between w-full pt-1">
              <span
                className={cn(
                  "text-sm font-medium flex-1 truncate pr-2",
                  match.winner?.id === match.player2?.id && "text-primary font-bold",
                )}
              >
                {match.player2 ? `${match.player2.name}${typeof match.player2.handicap === 'number' ? ` (${match.player2.handicap})` : ''}` : "TBD"}
              </span>
              {match.isCompleted && match.score2 !== undefined && (
                <span className={cn(
                  "text-sm font-bold w-6 text-center px-1 rounded",
                  Number(match.score2) > Number(match.score1) ? "bg-green-600 text-white" : "bg-red-600 text-white"
                )}>
                  {match.score2}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {canSetScore && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs bg-transparent mt-2"
            onClick={handleSetScoreClick}
          >
            Set Score
          </Button>
          <Dialog 
            open={isOpen && isOwner} 
            onOpenChange={(open) => {
              // Only allow opening if user is owner
              if (!isOwner) {
                if (typeof window !== 'undefined' && window.toast) {
                  window.toast.error('Unauthorized: Only tournament owner can update scores')
                } else {
                  alert('Unauthorized: Only tournament owner can update scores')
                }
                return
              }
              setIsOpen(open)
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Match Result</DialogTitle>
                <DialogDescription>
                  Enter the score for both players and select the winner.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{match.player1?.name}</label>
                    <Input
                      type="number"
                      value={score1}
                      onChange={(e) => setScore1(e.target.value)}
                      placeholder="Score"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{match.player2?.name}</label>
                    <Input
                      type="number"
                      value={score2}
                      onChange={(e) => setScore2(e.target.value)}
                      placeholder="Score"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSubmit(match.player1!.id)}
                    className="flex-1"
                    disabled={!score1 || !score2}
                  >
                    {match.player1?.name} Wins
                  </Button>
                  <Button
                    onClick={() => handleSubmit(match.player2!.id)}
                    className="flex-1"
                    disabled={!score1 || !score2}
                  >
                    {match.player2?.name} Wins
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
