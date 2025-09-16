import type { Tournament } from "@/types/tournament"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TournamentHeaderProps {
  tournament: Tournament
}

export function TournamentHeader({ tournament }: TournamentHeaderProps) {
  const completedMatches = tournament.matches.filter((match) => match.isCompleted).length
  const totalMatches = tournament.matches.length
  const progress = (completedMatches / totalMatches) * 100

  const champion = tournament.matches.find(
    (match) => match.round === tournament.totalRounds && match.isCompleted,
  )?.winner

  return (
    <div className="w-full mb-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary mb-2">{tournament.name}</h1>
        <p className="text-muted-foreground">Single Elimination Tournament • {tournament.totalPlayers} Players</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedMatches}/{totalMatches}
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Round</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tournament.matches.find((m) => !m.isCompleted)?.round || tournament.totalRounds}
            </div>
            <p className="text-sm text-muted-foreground">of {tournament.totalRounds} rounds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Champion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{champion ? champion.name : "TBD"}</div>
            <p className="text-sm text-muted-foreground">
              {champion ? "🏆 Tournament Winner" : "Tournament in progress"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
