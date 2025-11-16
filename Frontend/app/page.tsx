"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, BookOpen, Trophy, ArrowRight, Search, Code, Palette, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KolabIT</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
              Explore Skills
            </Link>
            <Link href="/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
              Projects
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900 transition-colors">
              Community
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Messages
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {!isAuthenticated && (
              <>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-20 lg:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 inline-block">
              <Badge className="bg-orange-500 text-white hover:bg-orange-600 text-sm px-4 py-1">
                🎓 Built for Students, By Students
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance text-gray-900 leading-tight">
              Unlock Your Campus
              <span className="text-orange-500 block mt-2">Potential</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Connect with fellow students, share your skills, and collaborate on amazing projects. KolabIT transforms
              your university into a thriving skill-sharing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-lg px-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105" asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                  Start Collaborating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-white border-2 border-orange-200 text-gray-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all"
                asChild
              >
                <Link href="/explore">
                  Explore Skills
                  <Search className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 mb-4">
              ✨ Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900">Why Choose KolabIT?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make skill-sharing and collaboration effortless on your campus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-xl">Skill-Based Matching</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Find the perfect collaborators based on complementary skills and shared interests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-xl">Resource Sharing</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Access a vast library of study materials, tutorials, and project resources shared by peers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-xl">Achievement System</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Earn badges and recognition for your contributions to the campus community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 mb-4">
              🚀 Skills
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900">Popular Skills on Campus</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the most in-demand skills being shared by students across universities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-2xl transition-all bg-white border-2 hover:border-orange-200 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Programming</CardTitle>
                <CardDescription className="text-gray-600">Python, JavaScript, Java, C++</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold">
                  850+ Students
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all bg-white border-2 hover:border-orange-200 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Design</CardTitle>
                <CardDescription className="text-gray-600">UI/UX, Graphic Design, Figma</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold">
                  620+ Students
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all bg-white border-2 hover:border-orange-200 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Marketing</CardTitle>
                <CardDescription className="text-gray-600">Digital Marketing, Analytics, SEO</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold">
                  480+ Students
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all bg-white border-2 hover:border-orange-200 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Research</CardTitle>
                <CardDescription className="text-gray-600">Data Analysis, Writing, Statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold">
                  390+ Students
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 mb-4">
              💬 Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900">What Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students who have transformed their university experience through KolabIT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/smiling-female-student.png" />
                    <AvatarFallback className="bg-orange-500 text-white font-semibold">SR</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Sanchit Raut</CardTitle>
                    <CardDescription className="text-gray-600">SPIT</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600">
                  "KolabIT helped me find amazing teammates for my capstone project. The skill matching feature is
                  incredible!"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/male-student-confident.jpg" />
                    <AvatarFallback className="bg-orange-500 text-white font-semibold">AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Anuj Singh</CardTitle>
                    <CardDescription className="text-gray-600">SPIT</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600">
                  "I've learned more through peer collaboration on KolabIT than in some of my classes. The community is
                  amazing!"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/female-student-creative.jpg" />
                    <AvatarFallback className="bg-orange-500 text-white font-semibold">VK</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Vedant Kannurkar</CardTitle>
                    <CardDescription className="text-gray-600">SPIT</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600">
                  "The resource sharing feature saved me countless hours. I found exactly what I needed for my portfolio
                  project."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-orange-50 mb-8 leading-relaxed">
              Join thousands of students who are already collaborating, learning, and growing together on KolabIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 border-0 text-lg px-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold" asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to Dashboard" : "Join KolabIT Today"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all shadow-lg font-semibold"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold text-gray-900">KolabIT</span>
              </div>
              <p className="text-gray-600">
                Empowering university students through skill-based collaboration and community engagement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Platform</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/explore" className="hover:text-gray-900 transition-colors">
                    Explore Skills
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-gray-900 transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-gray-900 transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-gray-900 transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-gray-900 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-gray-900 transition-colors">
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-900 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="hover:text-gray-900 transition-colors">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-gray-900 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-gray-900 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gray-900 transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 KolabIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
