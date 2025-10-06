"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Trophy, Home, Info } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <nav ref={navRef} className="bg-[#18181b] border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-white">
              Billiard<span className="text-accent">Pro</span>
            </span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-200 hover:text-accent transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/tournaments"
              className="flex items-center space-x-2 text-gray-200 hover:text-accent transition-colors duration-200"
            >
              <Trophy className="h-4 w-4" />
              <span>Tournaments</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-2 text-gray-200 hover:text-accent transition-colors duration-200"
            >
              <Info className="h-4 w-4" />
              <span>About Us</span>
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2 bg-transparent border-gray-600 text-gray-200 hover:bg-gray-800">
              <User className="h-4 w-4" />
              <span>Login</span>
            </Button>

            {/* Mobile Menu Button */}
            <div className="flex flex-col items-center md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-200 relative animate-pulse border border-accent/40"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
                style={{ boxShadow: mobileOpen ? '0 0 0 2px #22d3ee' : undefined }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-700 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-200 hover:text-accent transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/tournaments"
                className="flex items-center space-x-2 text-gray-200 hover:text-accent transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                <span>Tournaments</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-2 text-gray-200 hover:text-accent transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                <Info className="h-4 w-4" />
                <span>About Us</span>
              </Link>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 w-fit bg-transparent border-gray-600 text-gray-200 hover:bg-gray-800">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
