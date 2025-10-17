"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchTournamentDetail } from "@/lib/fetch-tournament-detail";
import { TournamentHeader } from "@/components/tournament-header";
import { TournamentBracket } from "@/components/tournament-bracket";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

export default function TournamentBracketPage() {
  const params = useParams();
  const tournamentId = params?.id as string;
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user on mount and listen for auth changes
  useEffect(() => {
    // Initial user fetch
    async function fetchUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Error fetching user:', error);
        setCurrentUserId(null);
      }
    }
    fetchUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUserId(session?.user?.id || null);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!tournamentId) return;
      
      try {
        setLoading(true);
        setError(null);
        const detail = await fetchTournamentDetail(tournamentId);
        
        if (!isMounted) return;
        
        if (!detail || !detail.tournament) {
          throw new Error("Tournament not found");
        }

        const bracketData = transformDbToBracket(detail);
        setTournament(bracketData);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error fetching tournament:', err);
        setError(err.message || "Failed to fetch tournament");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tournamentId]);

  function transformDbToBracket({ tournament, players, matches }: any) {
    const playerMap = Object.fromEntries((players as any[]).map((p: any) => [p.id, {
      id: p.id,
      name: p.name,
      seed: p.seed_number,
      handicap: p.handicap
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
      owner_id: tournament.owner_id
    };
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d] text-gray-200">
      <div className="container mx-auto py-12 text-center">
        <div className="animate-pulse">Loading tournament bracket...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d] text-gray-200">
      <div className="container mx-auto py-12 text-center">
        <div className="text-red-500 font-medium">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!tournament) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d] text-gray-200">
      <div className="container mx-auto py-12 text-center">
        <div className="text-gray-400">Tournament not found</div>
      </div>
    </div>
  );

  const handleTournamentUpdate = async () => {
    try {
      setLoading(true);
      const detail = await fetchTournamentDetail(tournamentId);
      
      if (!detail || !detail.tournament) {
        throw new Error("Tournament not found");
      }

      const bracketData = transformDbToBracket(detail);
      setTournament(bracketData);
      setError(null);
    } catch (err: any) {
      console.error('Error updating tournament:', err);
      setError(err.message || 'Failed to refresh bracket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d] text-gray-200">
      <div className="container mx-auto py-8">
        <TournamentHeader tournament={tournament} />
        <TournamentBracket 
          tournament={tournament} 
          onTournamentUpdate={handleTournamentUpdate}
          currentUserId={currentUserId}
        />
      </div>
      <Toaster />
    </main>
  );
}
