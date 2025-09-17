"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchTournamentDetail } from "@/lib/fetch-tournament-detail";
import { TournamentHeader } from "@/components/tournament-header";
import { TournamentBracket } from "@/components/tournament-bracket";

export default function TournamentBracketPage() {
  const params = useParams();
  const tournamentId = params?.id as string;
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const detail = await fetchTournamentDetail(tournamentId);
        const bracketData = transformDbToBracket(detail);
        setTournament(bracketData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tournament");
      } finally {
        setLoading(false);
      }
    }
    if (tournamentId) fetchData();
  }, [tournamentId]);

  function transformDbToBracket({ tournament, players, matches }: any) {
    const playerMap = Object.fromEntries((players as any[]).map((p: any) => [p.id, p]));
    const enrichedMatches = (matches as any[]).map((m: any) => ({
      ...m,
      player1: m.player1_id ? playerMap[m.player1_id] : null,
      player2: m.player2_id ? playerMap[m.player2_id] : null,
      winner: m.winner_id ? playerMap[m.winner_id] : null,
      score1: m.score_player1,
      score2: m.score_player2,
      isCompleted: m.is_completed,
      round: m.round,
      id: m.id,
    }));
    const totalRounds = Math.log2(tournament.total_players);
    return {
      ...tournament,
      matches: enrichedMatches,
      totalRounds,
      totalPlayers: tournament.total_players,
    };
  }

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!tournament) return <div className="text-center py-12">Tournament not found</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d] text-gray-200">
      <div className="container mx-auto py-8">
        <TournamentHeader tournament={tournament} />
        <TournamentBracket tournament={tournament} onTournamentUpdate={() => {}} />
      </div>
    </main>
  );
}
