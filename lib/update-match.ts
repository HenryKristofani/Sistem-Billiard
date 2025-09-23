import { supabase } from './supabase'

export async function updateMatchInDB(matchId: string, winnerId: number, score1: number, score2: number) {
  try {
    // Start a transaction by getting the match first
    const { data: matchToUpdate, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()

    if (fetchError) throw fetchError

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

    // Calculate the next match number
    const nextMatchNumber = Math.ceil(matchToUpdate.match_number / 2)
    
    // Get the next match in the tournament
    const { data: nextMatch, error: nextMatchError } = await supabase
      .from('matches')
      .select('*')
      .eq('tournament_id', matchToUpdate.tournament_id)
      .eq('round', matchToUpdate.round + 1)
      .eq('match_number', nextMatchNumber)
      .single()

    // Only throw error if it's not "no rows returned"
    if (nextMatchError && nextMatchError.code !== 'PGRST116') throw nextMatchError

    // If there is a next match, update its player
    if (nextMatch) {
      // If match_number is odd, update player1; if even, update player2
      const isEvenMatch = matchToUpdate.match_number % 2 === 0
      const updateData = isEvenMatch 
        ? { player2_id: winnerId }
        : { player1_id: winnerId }

      console.log('Updating next match:', {
        matchId: nextMatch.id,
        currentMatch: matchToUpdate.match_number,
        nextMatchNumber,
        isEvenMatch,
        updateData
      })

      const { error: advanceError } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', nextMatch.id)

      if (advanceError) throw advanceError
    }

    return matchToUpdate
  } catch (error) {
    console.error('Error updating match:', error)
    throw error
  }

  return matchId
}