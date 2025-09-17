import { supabase } from './supabase'

export async function fetchTournamentDetail(tournamentId: string) {
  // Fetch tournament
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()
  if (tournamentError) throw tournamentError

  // Fetch players
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('*')
    .eq('tournament_id', tournamentId)
  if (playersError) throw playersError

  // Fetch matches
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', tournamentId)
  if (matchesError) throw matchesError

  return { tournament, players, matches }
}
