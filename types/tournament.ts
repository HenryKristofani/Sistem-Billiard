export interface Player {
  id: number
  name: string
  seed: number
  handicap?: number
}

export interface Match {
  id: string
  round: number
  position: number
  match_number: number
  player1?: Player
  player2?: Player
  winner?: Player
  score1?: number
  score2?: number
  isCompleted: boolean
}

export interface Tournament {
  status: string | undefined
  id: string
  name: string
  totalPlayers: number
  totalRounds: number
  matches: Match[]
  players: Player[]
  owner_id?: string | null
}
