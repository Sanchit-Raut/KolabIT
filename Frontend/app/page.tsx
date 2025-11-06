import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, BookOpen, Trophy, ArrowRight, Search, Code, Palette, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              Sign In
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance text-gray-900">
              Unlock Your Campus
              <span className="text-orange-500"> Potential</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 text-pretty max-w-3xl mx-auto">
              Connect with fellow students, share your skills, and collaborate on amazing projects. KolabIT transforms
              your university into a thriving skill-sharing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-lg px-8">
                Start Collaborating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-white border-2 border-orange-200 text-gray-700 hover:bg-orange-50"
              >
                Explore Skills
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">2,500+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">150+</div>
                <div className="text-sm text-gray-600">Skills Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">400+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">50+</div>
                <div className="text-sm text-gray-600">Universities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Why Choose KolabIT?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make skill-sharing and collaboration effortless on your campus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900">Skill-Based Matching</CardTitle>
                <CardDescription className="text-gray-600">
                  Find the perfect collaborators based on complementary skills and shared interests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900">Resource Sharing</CardTitle>
                <CardDescription className="text-gray-600">
                  Access a vast library of study materials, tutorials, and project resources shared by peers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900">Achievement System</CardTitle>
                <CardDescription className="text-gray-600">
                  Earn badges and recognition for your contributions to the campus community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Popular Skills on Campus</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the most in-demand skills being shared by students across universities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Programming</CardTitle>
                <CardDescription className="text-gray-600">Python, JavaScript, Java, C++</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  850+ Students
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Design</CardTitle>
                <CardDescription className="text-gray-600">UI/UX, Graphic Design, Figma</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  620+ Students
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Marketing</CardTitle>
                <CardDescription className="text-gray-600">Digital Marketing, Analytics, SEO</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  480+ Students
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-gray-900">Research</CardTitle>
                <CardDescription className="text-gray-600">Data Analysis, Writing, Statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">What Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students who have transformed their university experience through KolabIT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/smiling-female-student.png" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Sarah Martinez</CardTitle>
                    <CardDescription className="text-gray-600">Computer Science, MIT</CardDescription>
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

            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/male-student-confident.jpg" />
                    <AvatarFallback>DJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-900">David Johnson</CardTitle>
                    <CardDescription className="text-gray-600">Business, Stanford</CardDescription>
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

            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/female-student-creative.jpg" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Anna Lee</CardTitle>
                    <CardDescription className="text-gray-600">Design, RISD</CardDescription>
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
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students who are already collaborating, learning, and growing together on KolabIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-lg px-8">
                Join KolabIT Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-white border-2 border-orange-200 text-gray-700 hover:bg-orange-50"
              >
                Learn More
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
            <p>&copy; 2024 KolabIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
