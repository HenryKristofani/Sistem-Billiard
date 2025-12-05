"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Name, email and password are required.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("");
    // Supabase register
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          display_name: name
        }
      }
    });
    if (error) {
      setError(error.message);
      return;
    }
    setShowSuccessPopup(true);
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] to-[#23272f] relative">
      <div className="w-full max-w-md bg-[#18181b]/90 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#23272f] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
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
          <Button type="submit" className="w-full text-lg font-semibold">Register</Button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">Login</Link>
        </p>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-2xl p-6 max-w-md mx-4 border border-gray-800 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <button 
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
            <p className="text-gray-300 mb-4">
              Please check your email inbox and click the verification link to activate your account.
            </p>
            <p className="text-sm text-gray-400">
              You'll be redirected to the login page when you close this notification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
