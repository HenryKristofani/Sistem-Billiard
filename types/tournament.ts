export interface Player {
  id: number
  name: string
  seed: number
}

export interface Match {
  id: string
  round: number
  position: number
  player1?: Player
  player2?: Player
  winner?: Player
  score1?: number
  score2?: number
  isCompleted: boolean
}

export interface Tournament {
  id: string
  name: string
  totalPlayers: number
  totalRounds: number
  matches: Match[]
  players: Player[]
}
