import { supabase } from './supabase'

export async function updateMatchAndAdvance(
  matchId: string, 
  winnerId: number, 
  score1: number, 
  score2: number
) {
  // Start a transaction
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single()

  if (matchError) throw matchError

  // Update the current match
  const { error: updateError } = await supabase
    .from('matches')
    .update({
      score_player1: score1,
      score_player2: score2,
      winner_id: winnerId,
      is_completed: true
    })
    .eq('id', matchId)

  if (updateError) throw updateError

  // Find the next match
  const nextRound = match.round + 1
  const nextMatchNumber = Math.ceil(match.match_number / 2)

  console.log('Finding next match:', {
    currentMatch: match.match_number,
    nextRound,
    nextMatchNumber
  })

  const { data: nextMatch, error: nextMatchError } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', match.tournament_id)
    .eq('round', nextRound)
    .eq('match_number', nextMatchNumber)
    .maybeSingle() // Use maybeSingle instead of single to not error if no match found

  // Only throw error if it's not a "no rows returned" error
  if (nextMatchError && nextMatchError.code !== 'PGRST116') throw nextMatchError

  // If there's a next match, update it
  if (nextMatch) {
    const isEvenMatch = match.match_number % 2 === 0
    const updateData = isEvenMatch 
      ? { player2_id: winnerId }
      : { player1_id: winnerId }

    console.log('Advancing winner:', {
      from: {
        round: match.round,
        match: match.match_number,
        winner: winnerId
      },
      to: {
        round: nextRound,
        match: nextMatchNumber,
        field: isEvenMatch ? 'player2' : 'player1'
      }
    })

    const { error: advanceError } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', nextMatch.id)

    if (advanceError) throw advanceError
  }

  return { success: true }
}