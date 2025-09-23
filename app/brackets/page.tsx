// "use client"

// import { useState } from "react"
// import type { Tournament } from "@/types/tournament"
// import { createTournament } from "@/lib/tournament-utils"
// import { TournamentHeader } from "@/components/tournament-header"
// import { TournamentBracket } from "@/components/tournament-bracket"

// export default function BracketsPage() {
//   const [tournament] = useState<Tournament>(() => createTournament("Billiard Championship 2024", 128))
//   const [currentTournament, setCurrentTournament] = useState<Tournament>(tournament)

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1d] text-gray-200">
//       <div className="container mx-auto py-8">
//         <TournamentHeader tournament={currentTournament} />
//         <TournamentBracket tournament={currentTournament} onTournamentUpdate={setCurrentTournament} />
//       </div>
//     </main>
//   )
// }

