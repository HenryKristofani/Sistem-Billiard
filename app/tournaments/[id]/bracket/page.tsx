"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchTournamentDetail } from "@/lib/fetch-tournament-detail";
import { TournamentHeader } from "@/components/tournament-header";
import { TournamentBracket } from "@/components/tournament-bracket";
import { Toaster } from "@/components/ui/sonner";

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
    const playerMap = Object.fromEntries((players as any[]).map((p: any) => [p.id, {
      id: p.id,
      name: p.name,
      seed: p.seed_number
    }]));
    const enrichedMatches = (matches as any[]).map((m: any) => ({
      ...m,
      player1: m.player1_id ? playerMap[m.player1_id] : null,
      player2: m.player2_id ? playerMap[m.player2_id] : null,
      winner: m.winner_id ? playerMap[m.winner_id] : null,
      score1: m.score_player1,
      isCompleted: m.is_completed,
      round: m.round,
      score2: m.score_player2,
      id: m.id,
      match_number: m.match_number,
      position: m.match_number // Use match_number as position
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

  const handleTournamentUpdate = async () => {
    try {
      const detail = await fetchTournamentDetail(tournamentId);
      const bracketData = transformDbToBracket(detail);
      setTournament(bracketData);
    } catch (err) {
      setError('Failed to refresh bracket');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d] text-gray-200">
      <div className="container mx-auto py-8">
        <TournamentHeader tournament={tournament} />
        <TournamentBracket tournament={tournament} onTournamentUpdate={handleTournamentUpdate} />
      </div>
      <Toaster />
    </main>
  );
}
