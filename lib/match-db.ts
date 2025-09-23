import { supabase } from './supabase'

export async function updateMatch(matchId: string, winnerId: number, score1: number, score2: number) {
  try {
    // 1. Get current match info
    const { data: currentMatch, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()

    if (matchError) {
      console.error('Error getting current match:', matchError)
      return false
    }

    // 2. Update current match with scores and winner
    const { error: updateError } = await supabase
      .from('matches')
      .update({
        winner_id: winnerId,
        score_player1: score1,
        score_player2: score2,
        is_completed: true
      })
      .eq('id', matchId)

    if (updateError) {
      console.error('Error updating match:', updateError)
      return false
    }

    // 3. Calculate next match details
    const nextRound = currentMatch.round + 1
    const nextMatchNumber = Math.ceil(currentMatch.match_number / 2)
    const isEvenMatch = currentMatch.match_number % 2 === 0

    console.log('Match update info:', {
      currentMatch: currentMatch.match_number,
      nextRound,
      nextMatchNumber,
      isEvenMatch
    })

    // 4. Get next match if it exists
    const { data: existingMatches, error: checkError } = await supabase
      .from('matches')
      .select()
      .eq('tournament_id', currentMatch.tournament_id)
      .eq('round', nextRound)
      .eq('match_number', nextMatchNumber)

    if (checkError) {
      console.error('Error checking next match:', checkError)
      return false
    }

    // If next match doesn't exist, create it
    if (!existingMatches || existingMatches.length === 0) {
      console.log('Creating next match:', {
        round: nextRound,
        matchNumber: nextMatchNumber
      })

      const { error: createError } = await supabase
        .from('matches')
        .insert({
          tournament_id: currentMatch.tournament_id,
          round: nextRound,
          match_number: nextMatchNumber,
          [isEvenMatch ? 'player2_id' : 'player1_id']: winnerId,
          is_completed: false
        })

      if (createError) {
        console.error('Error creating next match:', createError)
        return false
      }
    } else {
      // Update existing next match
      console.log('Updating existing match:', {
        matchId: existingMatches[0].id,
        field: isEvenMatch ? 'player2_id' : 'player1_id',
        value: winnerId
      })

      const { error: advanceError } = await supabase
        .from('matches')
        .update({
          [isEvenMatch ? 'player2_id' : 'player1_id']: winnerId
        })
        .eq('id', existingMatches[0].id)

      if (advanceError) {
        console.error('Error advancing winner:', advanceError)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error in updateMatch:', error)
    return false
  }
}