"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, MapPin, MessageCircle, UserPlus, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [university, setUniversity] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for students
  const students = [
    {
      id: "sarah_codes",
      name: "Sarah Martinez",
      username: "sarah_codes",
      avatar: "/smiling-female-student.png",
      university: "MIT",
      major: "Computer Science",
      year: "Junior",
      location: "Cambridge, MA",
      rating: 4.9,
      reviewCount: 47,
      skills: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
      topSkills: ["JavaScript", "React", "Python"],
      availability: "Available",
      bio: "Full-stack developer passionate about creating innovative web applications and mentoring fellow students.",
      projectsCompleted: 23,
      responseTime: "Usually responds within 2 hours",
    },
    {
      id: "david_design",
      name: "David Johnson",
      username: "david_design",
      avatar: "/male-student-confident.jpg",
      university: "Stanford",
      major: "Design",
      year: "Senior",
      location: "Palo Alto, CA",
      rating: 4.8,
      reviewCount: 32,
      skills: ["Figma", "Adobe Creative Suite", "UI/UX Design", "Prototyping", "User Research"],
      topSkills: ["Figma", "UI/UX Design", "Prototyping"],
      availability: "Limited",
      bio: "Product designer with experience in user-centered design and rapid prototyping for startups.",
      projectsCompleted: 18,
      responseTime: "Usually responds within 4 hours",
    },
    {
      id: "anna_ai",
      name: "Anna Lee",
      username: "anna_ai",
      avatar: "/female-student-creative.jpg",
      university: "Carnegie Mellon",
      major: "Machine Learning",
      year: "Graduate",
      location: "Pittsburgh, PA",
      rating: 4.9,
      reviewCount: 28,
      skills: ["Python", "TensorFlow", "PyTorch", "Data Science", "Machine Learning", "Deep Learning"],
      topSkills: ["Python", "TensorFlow", "Machine Learning"],
      availability: "Available",
      bio: "ML researcher specializing in computer vision and natural language processing applications.",
      projectsCompleted: 15,
      responseTime: "Usually responds within 1 hour",
    },
    {
      id: "mike_mobile",
      name: "Michael Chen",
      username: "mike_mobile",
      avatar: "/asian-male-student-developer.jpg",
      university: "UC Berkeley",
      major: "Computer Science",
      year: "Senior",
      location: "Berkeley, CA",
      rating: 4.7,
      reviewCount: 41,
      skills: ["React Native", "Swift", "Kotlin", "Flutter", "Mobile Development"],
      topSkills: ["React Native", "Swift", "Flutter"],
      availability: "Available",
      bio: "Mobile app developer with 3+ years of experience building iOS and Android applications.",
      projectsCompleted: 27,
      responseTime: "Usually responds within 3 hours",
    },
    {
      id: "lisa_data",
      name: "Lisa Wang",
      username: "lisa_data",
      avatar: "/asian-female-student-data-scientist.jpg",
      university: "MIT",
      major: "Data Science",
      year: "Junior",
      location: "Cambridge, MA",
      rating: 4.8,
      reviewCount: 35,
      skills: ["Python", "R", "SQL", "Tableau", "Data Analysis", "Statistics"],
      topSkills: ["Python", "SQL", "Data Analysis"],
      availability: "Available",
      bio: "Data science enthusiast with expertise in statistical analysis and data visualization.",
      projectsCompleted: 19,
      responseTime: "Usually responds within 2 hours",
    },
    {
      id: "alex_backend",
      name: "Alex Rodriguez",
      username: "alex_backend",
      avatar: "/hispanic-male-student-programmer.jpg",
      university: "Stanford",
      major: "Computer Science",
      year: "Senior",
      location: "Palo Alto, CA",
      rating: 4.9,
      reviewCount: 52,
      skills: ["Java", "Spring Boot", "PostgreSQL", "AWS", "Docker", "Microservices"],
      topSkills: ["Java", "Spring Boot", "AWS"],
      availability: "Limited",
      bio: "Backend engineer with experience in scalable system design and cloud architecture.",
      projectsCompleted: 31,
      responseTime: "Usually responds within 6 hours",
    },
  ]

  const skillCategories = [
    "Programming",
    "Frontend",
    "Backend",
    "Mobile",
    "Design",
    "AI/ML",
    "Data Science",
    "DevOps",
    "Database",
  ]

  const popularSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Java",
    "UI/UX Design",
    "Machine Learning",
    "SQL",
    "AWS",
    "Docker",
    "Figma",
    "Swift",
    "Flutter",
    "TensorFlow",
    "PostgreSQL",
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchQuery === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.bio.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((skill) => student.skills.includes(skill))

    const matchesAvailability =
      availability === "all" || student.availability.toLowerCase() === availability.toLowerCase()

    const matchesUniversity = university === "all" || student.university === university

    return matchesSearch && matchesSkills && matchesAvailability && matchesUniversity
  })

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

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
          <h1 className="text-3xl font-bold mb-2">Discover Student Skills</h1>
          <p className="text-muted-foreground text-lg">
            Find talented students to collaborate with on your next project
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, skills, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(selectedSkills.length > 0 || availability !== "all" || university !== "all") && (
                <Badge variant="secondary" className="ml-2">
                  {selectedSkills.length + (availability !== "all" ? 1 : 0) + (university !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
            <div className="text-sm text-muted-foreground">{filteredStudents.length} students found</div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Popular Skills */}
                <div>
                  <h3 className="font-semibold mb-3">Popular Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Availability</label>
                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="available">Available Now</SelectItem>
                        <SelectItem value="limited">Limited Availability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">University</label>
                    <Select value={university} onValueChange={setUniversity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Universities</SelectItem>
                        <SelectItem value="MIT">MIT</SelectItem>
                        <SelectItem value="Stanford">Stanford</SelectItem>
                        <SelectItem value="Carnegie Mellon">Carnegie Mellon</SelectItem>
                        <SelectItem value="UC Berkeley">UC Berkeley</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience Level</label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSkills([])
                    setAvailability("all")
                    setUniversity("all")
                    setExperienceLevel("all")
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>@{student.username}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={student.availability === "Available" ? "default" : "secondary"}>
                    {student.availability}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {student.university}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {student.rating} ({student.reviewCount})
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {student.major} • {student.year}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-pretty">{student.bio}</p>

                {/* Top Skills */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.topSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{student.projectsCompleted}</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{student.skills.length}</div>
                    <div className="text-xs text-muted-foreground">Skills</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">{student.responseTime}</div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button asChild className="flex-1 bg-transparent" variant="outline">
                    <Link href={`/profile/${student.id}`}>View Profile</Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more students.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedSkills([])
                setAvailability("all")
                setUniversity("all")
              }}
            >
              Clear Search & Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
