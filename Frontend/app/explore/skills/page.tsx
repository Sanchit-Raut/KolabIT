"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, TrendingUp, Users, Code, Palette, Database, Smartphone, Brain, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const skillCategories = [
    {
      name: "Programming Languages",
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      skills: [
        { name: "JavaScript", students: 850, growth: 15, difficulty: "Intermediate" },
        { name: "Python", students: 720, growth: 22, difficulty: "Beginner" },
        { name: "Java", students: 680, growth: 8, difficulty: "Intermediate" },
        { name: "TypeScript", students: 420, growth: 35, difficulty: "Intermediate" },
        { name: "C++", students: 380, growth: 5, difficulty: "Advanced" },
        { name: "Go", students: 180, growth: 45, difficulty: "Intermediate" },
      ],
    },
    {
      name: "Frontend Development",
      icon: Palette,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      skills: [
        { name: "React", students: 650, growth: 28, difficulty: "Intermediate" },
        { name: "Vue.js", students: 320, growth: 18, difficulty: "Intermediate" },
        { name: "Angular", students: 280, growth: 12, difficulty: "Advanced" },
        { name: "Svelte", students: 150, growth: 55, difficulty: "Intermediate" },
        { name: "Next.js", students: 380, growth: 40, difficulty: "Intermediate" },
      ],
    },
    {
      name: "Backend Development",
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-100",
      skills: [
        { name: "Node.js", students: 520, growth: 25, difficulty: "Intermediate" },
        { name: "Express.js", students: 480, growth: 20, difficulty: "Beginner" },
        { name: "Django", students: 350, growth: 15, difficulty: "Intermediate" },
        { name: "Spring Boot", students: 290, growth: 10, difficulty: "Advanced" },
        { name: "FastAPI", students: 180, growth: 50, difficulty: "Intermediate" },
      ],
    },
    {
      name: "Mobile Development",
      icon: Smartphone,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      skills: [
        { name: "React Native", students: 380, growth: 30, difficulty: "Intermediate" },
        { name: "Flutter", students: 320, growth: 42, difficulty: "Intermediate" },
        { name: "Swift", students: 250, growth: 18, difficulty: "Advanced" },
        { name: "Kotlin", students: 220, growth: 25, difficulty: "Advanced" },
        { name: "Xamarin", students: 120, growth: 8, difficulty: "Advanced" },
      ],
    },
    {
      name: "AI & Machine Learning",
      icon: Brain,
      color: "text-red-600",
      bgColor: "bg-red-100",
      skills: [
        { name: "TensorFlow", students: 280, growth: 38, difficulty: "Advanced" },
        { name: "PyTorch", students: 250, growth: 45, difficulty: "Advanced" },
        { name: "Scikit-learn", students: 320, growth: 25, difficulty: "Intermediate" },
        { name: "OpenCV", students: 180, growth: 30, difficulty: "Advanced" },
        { name: "Hugging Face", students: 150, growth: 60, difficulty: "Intermediate" },
      ],
    },
    {
      name: "Data Science",
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      skills: [
        { name: "Pandas", students: 420, growth: 28, difficulty: "Intermediate" },
        { name: "NumPy", students: 380, growth: 22, difficulty: "Intermediate" },
        { name: "Matplotlib", students: 350, growth: 18, difficulty: "Beginner" },
        { name: "Tableau", students: 280, growth: 15, difficulty: "Beginner" },
        { name: "Power BI", students: 220, growth: 25, difficulty: "Beginner" },
      ],
    },
  ]

  const trendingSkills = [
    { name: "Hugging Face", growth: 60, students: 150, category: "AI/ML" },
    { name: "Svelte", growth: 55, students: 150, category: "Frontend" },
    { name: "FastAPI", growth: 50, students: 180, category: "Backend" },
    { name: "Go", growth: 45, students: 180, category: "Programming" },
    { name: "PyTorch", growth: 45, students: 250, category: "AI/ML" },
    { name: "Flutter", growth: 42, students: 320, category: "Mobile" },
  ]

  const topMentors = [
    {
      name: "Sarah Martinez",
      avatar: "/smiling-female-student.png",
      skill: "JavaScript",
      students: 45,
      rating: 4.9,
      university: "MIT",
    },
    {
      name: "David Johnson",
      avatar: "/male-student-confident.jpg",
      skill: "UI/UX Design",
      students: 38,
      rating: 4.8,
      university: "Stanford",
    },
    {
      name: "Anna Lee",
      avatar: "/female-student-creative.jpg",
      skill: "Machine Learning",
      students: 32,
      rating: 4.9,
      university: "Carnegie Mellon",
    },
  ]

  const filteredCategories = skillCategories
    .map((category) => ({
      ...category,
      skills: category.skills.filter(
        (skill) => searchQuery === "" || skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.skills.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold">KolabIT</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-primary font-medium">
              Explore Skills
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </Link>
            <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
              Community
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost">Sign In</Button>
            <Button className="gradient-primary text-white border-0">Get Started</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skill Directory</h1>
          <p className="text-muted-foreground text-lg">
            Explore popular skills and find students who can teach or collaborate with you
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Trending Skills */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Trending Skills</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingSkills.map((skill, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">+{skill.growth}%</div>
                      <div className="text-xs text-muted-foreground">growth</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {skill.students} students
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Mentors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Top Skill Mentors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {topMentors.map((mentor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentor.university}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Specializes in</span>
                      <Badge variant="outline">{mentor.skill}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Students helped</span>
                      <span className="font-medium">{mentor.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rating</span>
                      <span className="font-medium">{mentor.rating}/5.0</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Skill Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Skills by Category</h2>
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon
              return (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>{category.skills.length} skills available</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{skill.name}</h4>
                            <Badge
                              variant={
                                skill.difficulty === "Beginner"
                                  ? "secondary"
                                  : skill.difficulty === "Intermediate"
                                    ? "default"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {skill.difficulty}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Students</span>
                              <span className="font-medium">{skill.students}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Growth</span>
                              <span className="font-medium text-green-600">+{skill.growth}%</span>
                            </div>
                            <Progress value={Math.min(skill.students / 10, 100)} className="h-2" />
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                            <Users className="h-4 w-4 mr-2" />
                            Find Students
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
