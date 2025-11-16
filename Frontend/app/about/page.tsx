"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { 
  Users, 
  Target, 
  Lightbulb, 
  Heart, 
  Github, 
  Linkedin, 
  Mail,
  Award,
  BookOpen,
  Code,
  Sparkles
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const developers = [
    {
      name: "Sanchit Raut",
      role: "Full Stack Developer",
      avatar: "/sanchit.jpg",
      initials: "SR",
      github: "https://github.com/Sanchit-raut",
      linkedin: "https://www.linkedin.com/in/sanchit-raut-b96b9a2b3/",
      email: "sanchit.raut23@spit.ac.in",
      bio: "Passionate about building scalable web applications and creating seamless user experiences.",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"]
    },
    {
      name: "Vedant Kannurkar",
      role: "Full Stack Developer",
      avatar: "/vedant.jpg",
      initials: "VK",
      github: "https://github.com/VedantVK7",
      linkedin: "https://www.linkedin.com/in/vedant-kannurkar/",
      email: "vedant.kannurkar24@spit.ac.in",
      bio: "Dedicated to crafting innovative solutions and optimizing application performance.",
      skills: ["Next.js", "Express", "Prisma", "API Design"]
    },
    {
      name: "Yash Jagtap",
      role: "Full Stack Developer",
      avatar: "/yash.jpg",
      initials: "YJ",
      github: "https://github.com/yash-jagtap",
      linkedin: "https://www.linkedin.com/in/yash-jagtap-496038291/",
      email: "yash.jagtap23@spit.ac.in",
      bio: "Enthusiastic about creating robust backend systems and delivering quality code.",
      skills: ["Backend", "Database", "Testing"]
    }
  ]

  const mentor = {
    name: "Dr. Sujata Kulkarni",
    role: "Project Mentor & Guide",
    department: "Computer Engineering Department, SPIT",
    avatar: "/dr-sujata.jpg",
    initials: "SK",
    email: "sujata_kulkarni@spit.ac.in",
    bio: "Distinguished faculty member with extensive experience in software engineering and student mentorship.",
    expertise: ["Machine Learning", "Database Systems", "Project Management", "Research Guidance"]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-orange-500 text-white hover:bg-orange-600 mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            About KolabIT
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
            Empowering Campus
            <span className="text-orange-500 block mt-2">Collaboration</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            KolabIT is a student-driven platform designed to foster skill-sharing, collaboration, 
            and community building within university campuses.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To create a vibrant ecosystem where students can discover, share, and enhance their skills 
                  through meaningful collaborations and peer-to-peer learning.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To transform university campuses into thriving hubs of innovation where every student 
                  has the opportunity to learn, teach, and grow together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Collaboration, inclusivity, continuous learning, and community empowerment drive 
                  everything we build and every decision we make.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Development Team */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 mb-4">
              <Code className="h-3 w-3 mr-1" />
              Meet the Team
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900">Development Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate developers from SPIT committed to building a better campus experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {developers.map((dev) => (
              <Card key={dev.name} className="border-2 hover:border-orange-300 transition-all hover:shadow-2xl group">
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-orange-100 group-hover:ring-orange-300 transition-all">
                    <AvatarImage src={dev.avatar} alt={dev.name} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                      {dev.initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl text-gray-900">{dev.name}</CardTitle>
                  <CardDescription className="text-orange-600 font-semibold">{dev.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4 leading-relaxed">{dev.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {dev.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-orange-100 text-orange-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-center gap-3 pt-4 border-t">
                    {dev.github && (
                      <Button variant="outline" size="icon" className="hover:bg-orange-50" asChild>
                        <a href={dev.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="hover:bg-orange-50" asChild>
                      <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-orange-50" asChild>
                      <a href={`mailto:${dev.email}`} aria-label="Email">
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 mb-4">
              <Award className="h-3 w-3 mr-1" />
              Mentorship
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900">Project Mentor</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Guided by excellence and expertise in software engineering.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-orange-200 shadow-xl">
              <CardHeader className="text-center pb-6">
                <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-orange-200">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-3xl font-bold">
                    {mentor.initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl text-gray-900 mb-2">{mentor.name}</CardTitle>
                <CardDescription className="text-orange-600 font-semibold text-lg mb-2">
                  {mentor.role}
                </CardDescription>
                <p className="text-gray-600">{mentor.department}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 text-center text-lg leading-relaxed">
                  {mentor.bio}
                </p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-center">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mentor.expertise.map((area) => (
                      <Badge key={area} variant="secondary" className="bg-orange-100 text-orange-700 text-sm">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button variant="outline" className="hover:bg-orange-50" asChild>
                    <a href={`mailto:${mentor.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Mentor
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-orange-50 mb-8 leading-relaxed">
              Start collaborating with talented students and build amazing projects together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 border-0 text-lg px-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold" asChild>
                <Link href="/register">
                  Get Started Now
                  <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all shadow-lg font-semibold"
                asChild
              >
                <Link href="/explore">Explore Platform</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">KolabIT</span>
            </div>
            <p className="text-gray-600 mb-4">
              A project by SPIT students, for university students everywhere.
            </p>
            <p className="text-sm text-gray-500">&copy; 2025 KolabIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
