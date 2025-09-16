import type { Player, Match, Tournament } from "@/types/tournament"

export function generatePlayers(count: number): Player[] {
  const players: Player[] = []
  for (let i = 1; i <= count; i++) {
    players.push({
      id: i,
      name: `Player ${i}`,
      seed: i,
    })
  }
  return players
}

export function generateMatches(players: Player[]): Match[] {
  const matches: Match[] = []
  const totalPlayers = players.length
  const totalRounds = Math.log2(totalPlayers)

  let matchId = 1

  // Generate matches for each round
  for (let round = 1; round <= totalRounds; round++) {
    const matchesInRound = totalPlayers / Math.pow(2, round)

    for (let position = 1; position <= matchesInRound; position++) {
      const match: Match = {
        id: `R${round}M${position}`,
        round,
        position,
        isCompleted: false,
      }

      // For first round, assign players
      if (round === 1) {
        const player1Index = (position - 1) * 2
        const player2Index = player1Index + 1
        match.player1 = players[player1Index]
        match.player2 = players[player2Index]
      }

      matches.push(match)
      matchId++
    }
  }

  return matches
}

export function createTournament(name: string, playerCount: number): Tournament {
  const players = generatePlayers(playerCount)
  const matches = generateMatches(players)

  return {
    id: `tournament-${Date.now()}`,
    name,
    totalPlayers: playerCount,
    totalRounds: Math.log2(playerCount),
    matches,
    players,
  }
}

export function updateMatchResult(
  tournament: Tournament,
  matchId: string,
  winnerId: number,
  score1: number,
  score2: number,
): Tournament {
  const updatedMatches = tournament.matches.map((match) => {
    if (match.id === matchId) {
      const winner = winnerId === match.player1?.id ? match.player1 : match.player2
      return {
        ...match,
        winner,
        score1,
        score2,
        isCompleted: true,
      }
    }
    return match
  })

  // Advance winner to next round
  const match = updatedMatches.find((m) => m.id === matchId)
  if (match && match.winner) {
    advanceWinner(updatedMatches, match)
  }

  return {
    ...tournament,
    matches: updatedMatches,
  }
}

function advanceWinner(matches: Match[], completedMatch: Match) {
  if (!completedMatch.winner) return

  const nextRound = completedMatch.round + 1
  const nextPosition = Math.ceil(completedMatch.position / 2)

  const nextMatch = matches.find((m) => m.round === nextRound && m.position === nextPosition)

  if (nextMatch) {
    if (completedMatch.position % 2 === 1) {
      nextMatch.player1 = completedMatch.winner
    } else {
      nextMatch.player2 = completedMatch.winner
    }
  }
}
