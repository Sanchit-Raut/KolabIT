"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, MessageCircle, SlidersHorizontal, Loader2, GraduationCap, Users } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { userApi, skillApi } from "@/lib/api"
import type { User } from "@/lib/types"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [year, setYear] = useState<string>("all")
  const [department, setDepartment] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [students, setStudents] = useState<User[]>([])
  const [availableSkills, setAvailableSkills] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch available skills from database
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillApi.getAllSkills(1, 100)
        const skills = response.data || []
        // Store both id and name
        setAvailableSkills(skills.map((skill: any) => ({ id: skill.id, name: skill.name })))
      } catch (err) {
        console.error("[v0] Error fetching skills:", err)
      }
    }
    fetchSkills()
  }, [])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const searchParams = {
          search: searchQuery || undefined,
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
          department: department !== "all" ? department : undefined,
          year: year !== "all" ? Number(year) : undefined,
        }
        console.log('[Explore] Search params:', searchParams)
        const data = await userApi.searchUsers(searchParams)
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
  }, [searchQuery, selectedSkills, department, year])

  const filteredStudents = students

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => (prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Talented Students</h1>
          <p className="text-muted-foreground text-lg">
            Find students to collaborate with based on skills, department, and academic year
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
              {(selectedSkills.length > 0 || year !== "all" || department !== "all") && (
                <Badge variant="secondary" className="ml-2">
                  {selectedSkills.length + (year !== "all" ? 1 : 0) + (department !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              <Users className="inline h-4 w-4 mr-1" />
              {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter Results</CardTitle>
                <CardDescription>Narrow down your search to find the perfect collaborator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills */}
                {availableSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.slice(0, 20).map((skill) => (
                        <Badge
                          key={skill.id}
                          variant={selectedSkills.includes(skill.id) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-orange-500 hover:text-white transition-colors"
                          onClick={() => toggleSkill(skill.id)}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Filters */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year</label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="1">First Year</SelectItem>
                        <SelectItem value="2">Second Year</SelectItem>
                        <SelectItem value="3">Third Year</SelectItem>
                        <SelectItem value="4">Fourth Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSkills([])
                    setYear("all")
                    setDepartment("all")
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
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.firstName} />
                          <AvatarFallback className="bg-orange-100 text-orange-700 text-lg">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {student.firstName} {student.lastName}
                          </h3>
                          <div className="flex flex-col gap-1 mt-1">
                            {student.department && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <BookOpen className="h-3 w-3" />
                                {student.department}
                              </div>
                            )}
                            {(student.year || student.semester) && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <GraduationCap className="h-3 w-3" />
                                {student.year && `Year ${student.year}`}
                                {student.year && student.semester && ' • '}
                                {student.semester && `Sem ${student.semester}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {student.bio || "No bio added"}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Skills */}
                      {student.skills && student.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {student.skills.slice(0, 3).map((skill: any) => (
                            <Badge key={skill.id} variant="secondary" className="text-xs">
                              {skill.skill?.name || skill.name}
                            </Badge>
                          ))}
                          {student.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                          <Link href={`/profile/${student.id}`}>View Profile</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" title="Send Message">
                          <Link href={`/messages/${student.id}`}>
                            <MessageCircle className="h-4 w-4" />
                          </Link>
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
                      setYear("all")
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
