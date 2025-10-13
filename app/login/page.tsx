"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    // Supabase login
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    // Redirect or show success
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] to-[#23272f]">
      <div className="w-full max-w-md bg-[#18181b]/90 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#23272f] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#23272f] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full text-lg font-semibold">Login</Button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
