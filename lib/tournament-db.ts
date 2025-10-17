import { supabase } from './supabase'

export async function createTournamentInDB(name: string, players: string[], handicaps: (number | null)[]) {
  // Get current user's ID from Supabase Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Insert tournament
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .insert({
      name,
      total_players: players.length,
      status: 'draft',
      owner_id: user.id
    })
    .select()
    .single()

  if (tournamentError) throw tournamentError

  // Insert players
  const playersData = players.map((name, index) => ({
    tournament_id: tournament.id,
    name,
    handicap: handicaps[index],
    seed_number: index + 1,
  }))

  const { data: insertedPlayers, error: playersError } = await supabase
    .from('players')
    .insert(playersData)
    .select()

  if (playersError) throw playersError

  // Generate matches data
  const matchesData = generateMatchesData(tournament.id, players.length)
  const { data: insertedMatches, error: matchesError } = await supabase
    .from('matches')
    .insert(matchesData)
    .select()

  if (matchesError) throw matchesError

  // Update round 1 matches with player1_id and player2_id
  const round1Matches = insertedMatches.filter((m: any) => m.round === 1)
  for (let i = 0; i < round1Matches.length; i++) {
    const player1 = insertedPlayers[i * 2]
    const player2 = insertedPlayers[i * 2 + 1]
    await supabase
      .from('matches')
      .update({
        player1_id: player1?.id,
        player2_id: player2?.id
      })
      .eq('id', round1Matches[i].id)
  }

  return tournament
}

function generateMatchesData(tournamentId: string, playerCount: number) {
  const matches = []
  const rounds = Math.log2(playerCount)

  // Generate matches for each round
  for (let round = 1; round <= rounds; round++) {
    const matchesInRound = playerCount / Math.pow(2, round)
    
    // For each round, match numbers start from 1
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        tournament_id: tournamentId,
        round,
        match_number: i + 1, // Match numbers start from 1 in each round
        is_completed: false,
      })
    }
  }

  return matches
}

export async function getTournamentsForCurrentUser() {
  // Get current user's ID from Supabase Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get only tournaments owned by the current user
  const { data: tournaments, error } = await supabase
    .from('tournaments')
    .select()
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return tournaments;
}
