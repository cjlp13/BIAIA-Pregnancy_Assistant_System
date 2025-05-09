import Link from "next/link"
import { ArrowRight, Calendar, Github, Heart, Layout, MessageSquare, Pencil, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/biaia-light.svg" alt="BIAIA Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm transition-colors hover:text-pink-500 text-gray-800">
              Features
            </Link>
            <Link href="#about" className="text-sm transition-colors hover:text-pink-500 text-gray-800">
              About
            </Link>
            <Link href="#collaborators" className="text-sm transition-colors hover:text-pink-500 text-gray-800">
              Collaborators
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-white">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-pink-500 text-white hover:bg-pink-600">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pink-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-pink-900">
                Welcome to <span className="text-pink-500">BIAIA</span>
              </h1>
              <p className="mt-4 md:text-xl text-pink-900">
                Your personal pregnancy companion, providing support and guidance throughout your journey to motherhood.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                <Link href="/register">
                  <Button className="bg-pink-500 text-white hover:bg-pink-600 px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50 px-8 bg-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-pink-700">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-pink-900">
                  Everything You Need During Pregnancy
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-pink-800">
                  BIAIA provides comprehensive tools to support you throughout your pregnancy journey.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Dashboard Feature */}
              <Card className="border-pink-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="rounded-full bg-pink-100 p-3">
                      <Layout className="h-6 w-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-pink-900">Dashboard</h3>
                    <p className="text-pink-800">
                      Quick summary of reminders, appointments, and pregnancy guidance with safe exercises and helpful
                      tips.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tracker Feature */}
              <Card className="border-pink-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="rounded-full bg-pink-100 p-3">
                      <Heart className="h-6 w-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-pink-900">Tracker</h3>
                    <p className="text-pink-800">
                      Track baby's development and your physical changes with detailed weekly pregnancy milestones.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Feature */}
              <Card className="border-pink-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="rounded-full bg-pink-100 p-3">
                      <MessageSquare className="h-6 w-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-pink-900">Chat</h3>
                    <p className="text-pink-800">
                      AI-powered chatbot that answers pregnancy questions and provides 24/7 support.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Journal Feature */}
              <Card className="border-pink-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="rounded-full bg-pink-100 p-3">
                      <Pencil className="h-6 w-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-pink-900">Journal</h3>
                    <p className="text-pink-800">
                      Document your pregnancy journey with personal notes, mood tracking, and memorable moments.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Appointments Feature */}
              <Card className="border-pink-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="rounded-full bg-pink-100 p-3">
                      <Calendar className="h-6 w-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-pink-900">Appointments</h3>
                    <p className="text-pink-800">
                      Schedule and track medical visits with clinic search functionality in your area.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Feature */}
              <Card className="border-pink-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    <div className="rounded-full bg-pink-100 p-3">
                      <User className="h-6 w-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold text-pink-900">Profile</h3>
                    <p className="text-pink-800">
                      Manage your personal and medical information in one secure, easy-to-update location.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 bg-gradient-to-b from-pink-950 to-pink-400 text-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4 text-center">
                <div className="inline-block rounded-lg bg-pink-500/20 px-3 py-1 text-sm text-pink-300">About Us</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission</h2>
                <p className="md:text-xl">
                  At BIAIA, we're dedicated to supporting expectant mothers throughout their pregnancy journey with
                  reliable information and personalized tools.
                </p>
                <p className="md:text-xl">
                  We believe every mother deserves access to quality resources during this important time in their
                  lives.
                </p>
                <p className="md:text-xl">
                  Our team combines medical expertise with technology to create an intuitive platform that grows with
                  you through each stage of pregnancy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Collaborators Section */}
        <section id="collaborators" className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-pink-700">Collaborators</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-pink-900">Our Team</h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-pink-800">
                  BIAIA is made possible by our dedicated team of developers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Justine Padua",
                  role: "Lead & Developer",
                  bio: "Building solutions while steering team direction",
                  github: "https://github.com/cjlp13",
                },
                {
                  name: "Elwin Barredo",
                  role: "Full Stack Developer",
                  bio: "Can design, code, and debug all layers",
                  github: "https://github.com/elwintheDEVisor",
                },
                {
                  name: "Vivs Garcia",
                  role: "Full Stack Developer",
                  bio: "Switches between UI and server logic",
                  github: "https://github.com/VivieneGarcia",
                },
                {
                  name: "John Yumul",
                  role: "UI/UX & QA",
                  bio: "Ensuring quality with user-centric design",
                  github: "https://github.com/John-Yumul",
                },
              ].map((person, i) => (
                <Card key={i} className="border-pink-100 bg-white shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="h-24 w-24 rounded-full bg-pink-100 flex items-center justify-center text-7xl">
                        💗
                      </div>
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-pink-900">{person.name}</h4>
                        <p className="text-pink-500 font-medium">{person.role}</p>
                        <p className="mt-2 text-pink-800">{person.bio}</p>
                        <a
                          href={person.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-700"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          GitHub Profile
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-pink-500 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Begin Your Journey</h2>
                <p className="mx-auto max-w-[700px] md:text-xl/relaxed text-pink-100">
                  Join BIAIA today and get the support you need throughout your pregnancy.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button className="bg-white text-pink-500 hover:bg-pink-50 px-8">Register Now</Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-pink-600/80 px-8 bg-transparent hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white py-6">
        <div className="container flex items-center justify-center px-4 md:px-6">
          <p className="text-center text-sm text-pink-800">&copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
