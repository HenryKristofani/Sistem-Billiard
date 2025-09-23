"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TournamentsListPage() {
	const [tournaments, setTournaments] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchTournaments() {
			try {
				const { data, error } = await supabase
					.from("tournaments")
					.select("*")
					.order("created_at", { ascending: false });
				if (error) throw error;
				setTournaments(data || []);
			} catch (err: any) {
				setError(err.message || "Failed to fetch tournaments");
			} finally {
				setLoading(false);
			}
		}
		fetchTournaments();
	}, []);

	return (
		<main className="min-h-screen bg-gradient-to-br from-[#18181b] to-[#23272f] text-white py-12">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-center">Daftar Turnamen</h1>
				{loading && <div className="text-center py-8">Loading...</div>}
				{error && <div className="text-center py-8 text-red-500">{error}</div>}
				{!loading && !error && (
					<ul className="space-y-4">
						{tournaments.length === 0 ? (
							<li className="text-center text-gray-400">Belum ada turnamen.</li>
						) : (
							tournaments.map((tournament) => (
								<li key={tournament.id} className="bg-[#23272f] rounded-lg shadow p-4 flex justify-between items-center">
									<div>
										<div className="text-lg font-semibold">{tournament.name}</div>
										<div className="text-sm text-gray-400">{tournament.total_players} pemain</div>
									</div>
									<Link
										href={`/tournaments/${tournament.id}/bracket`}
										className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
									>
										Lihat Bracket
									</Link>
								</li>
							))
						)}
					</ul>
				)}
			</div>
		</main>
	);
}
