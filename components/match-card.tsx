"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Match } from "@/types/tournament"
import { cn } from "@/lib/utils"

interface MatchCardProps {
  match: Match
  onUpdateMatch: (matchId: string, winnerId: number, score1: number, score2: number) => void
}

export function MatchCard({ match, onUpdateMatch }: MatchCardProps) {
  const [score1, setScore1] = useState(match.score1?.toString() || "")
  const [score2, setScore2] = useState(match.score2?.toString() || "")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (winnerId: number) => {
    const s1 = Number.parseInt(score1) || 0
    const s2 = Number.parseInt(score2) || 0
    
    // Validasi sederhana
    if (s1 < 0 || s2 < 0) {
      alert('Score tidak boleh negatif')
      return
    }
    
    // Pastikan winner sesuai dengan skor tertinggi
    if ((winnerId === match.player1?.id && s1 <= s2) || 
        (winnerId === match.player2?.id && s2 <= s1)) {
      alert('Pemenang harus memiliki skor lebih tinggi')
      return
    }
    
    onUpdateMatch(match.id, winnerId, s1, s2)
    setIsOpen(false)
  }

  const canPlay = match.player1 && match.player2

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
                {match.player1 ? `${match.player1.name} (${match.player1.handicap || 0})` : "TBD"}
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
                {match.player2 ? `${match.player2.name} (${match.player2.handicap || 0})` : "TBD"}
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
      {canPlay && !match.isCompleted && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent mt-2">
              Set Score
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Match Result</DialogTitle>
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
      )}
    </div>
  )
}
