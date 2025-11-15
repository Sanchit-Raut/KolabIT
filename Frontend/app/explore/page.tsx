"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, MessageCircle, UserPlus, SlidersHorizontal, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { userApi } from "@/lib/api"
import type { User } from "@/lib/types"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [department, setDepartment] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const data = await userApi.searchUsers({
          search: searchQuery || undefined,
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
          department: department !== "all" ? department : undefined,
        })
        // Handle both direct array and paginated response
        if (Array.isArray(data)) {
          setStudents(data)
        } else if (data?.users) {
          setStudents(data.users)
        } else if (data?.data) {
          setStudents(Array.isArray(data.data) ? data.data : [])
        } else {
          setStudents([])
        }
        setError("")
      } catch (err) {
        console.error("[v0] Error fetching students:", err)
        setError("Failed to load students. Please try again.")
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchStudents()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedSkills, department])

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
    const matchesAvailability = availability === "all"
    return matchesAvailability
  })

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              {(selectedSkills.length > 0 || availability !== "all" || department !== "all") && (
                <Badge variant="secondary" className="ml-2">
                  {selectedSkills.length + (availability !== "all" ? 1 : 0) + (department !== "all" ? 1 : 0)}
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
                        className="cursor-pointer hover:bg-orange-500 hover:text-white transition-colors"
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
                    <label className="text-sm font-medium">Department</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="CS">Computer Science</SelectItem>
                        <SelectItem value="IT">Information Technology</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
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
                    setDepartment("all")
                    setExperienceLevel("all")
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.firstName} />
                            <AvatarFallback>
                              {student.firstName?.[0]}
                              {student.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {student.firstName} {student.lastName}
                            </CardTitle>
                            <CardDescription>@{student.email?.split("@")[0]}</CardDescription>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {student.department || "Department"}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{student.bio || "No bio added"}</p>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
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
                ))
              ) : (
                <div className="col-span-full text-center py-12">
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
                      setDepartment("all")
                    }}
                  >
                    Clear Search & Filters
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
