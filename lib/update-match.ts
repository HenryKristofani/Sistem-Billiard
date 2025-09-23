import { supabase } from './supabase'

export async function updateMatchInDB(matchId: string, winnerId: number, score1: number, score2: number) {
  // Update the current match
  const { data: match, error: updateError } = await supabase
    .from('matches')
    .update({
      winner_id: winnerId,
      score_player1: score1,
      score_player2: score2,
      is_completed: true
    })
    .eq('id', matchId)
    .select()
    .single()

  if (updateError) throw updateError

  // Get the next match in the tournament
  const { data: nextMatch, error: nextMatchError } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', match.tournament_id)
    .eq('round', match.round + 1)
    .eq('match_number', Math.ceil(match.match_number / 2))
    .single()

  if (nextMatchError && nextMatchError.code !== 'PGRST116') throw nextMatchError // Ignore if no next match found

  // If there is a next match, update its player
  if (nextMatch) {
    const isEvenMatch = match.match_number % 2 === 0
    const updateData = isEvenMatch 
      ? { player2_id: winnerId }
      : { player1_id: winnerId }

    const { error: advanceError } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', nextMatch.id)

    if (advanceError) throw advanceError
  }

  return match
}