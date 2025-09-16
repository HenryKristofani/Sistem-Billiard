import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] to-[#23272f] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Elevate Your Game: <span className="text-accent">Master Your Tournament</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 text-pretty max-w-2xl mx-auto">
            Create professional billiard tournament brackets with ease. Support for multiple bracket sizes, real-time
            score tracking, and seamless tournament management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/create-tournament">New Tournament</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent border-gray-600 text-gray-200 hover:bg-gray-800">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#23272f]/80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-balance text-white">
            Everything You Need for Professional Tournaments
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-[#18181b] border-gray-700 text-white">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Multiple Bracket Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Support for 4, 8, 16, 32, 64, and 128 player tournaments. Perfect for any event size.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-[#18181b] border-gray-700 text-white">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Real-time Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Update match scores instantly and watch winners automatically advance to the next round.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-[#18181b] border-gray-700 text-white">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Horizontal Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Clean horizontal bracket visualization with smooth scrolling for large tournaments.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-[#18181b] border-gray-700 text-white">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Professional Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Dark theme with professional styling inspired by popular tournament platforms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-balance text-white">See It In Action</h2>
          <p className="text-xl text-gray-300 mb-8 text-pretty">
            Experience the smooth bracket visualization and intuitive tournament management
          </p>

          <div className="bg-[#18181b] rounded-lg p-8 border border-gray-700">
            <div className="aspect-video bg-[#23272f] rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
                <p className="text-lg font-medium text-white">Interactive Tournament Bracket</p>
                <p className="text-gray-400">Click "Get Started" to create your first tournament</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                Winner Highlighting
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#23272f] rounded-full"></div>
                Pending Matches
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                Connection Lines
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#23272f]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-balance text-white">Ready to Organize Your Tournament?</h2>
          <p className="text-lg text-gray-300 mb-8 text-pretty">
            Start creating professional tournament brackets in seconds. No registration required.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/tournament">Create Tournament Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500">
            Built with Next.js and TypeScript. Perfect for billiard tournaments and competitions.
          </p>
        </div>
      </footer>
    </div>
  )
}
