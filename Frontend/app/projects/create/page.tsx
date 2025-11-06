"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateProjectPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const availableSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Java",
    "C++",
    "Swift",
    "Kotlin",
    "UI/UX Design",
    "Figma",
    "Machine Learning",
    "TensorFlow",
    "Data Science",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "React Native",
    "Vue.js",
    "Django",
    "Flask",
  ]

  const categories = [
    "Web Development",
    "Mobile Development",
    "AI/Machine Learning",
    "Data Science",
    "Game Development",
    "VR/AR",
    "Blockchain",
    "IoT",
    "Cybersecurity",
  ]

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // TODO: Call API to create project
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/projects")
    } catch (err) {
      console.error("Error creating project:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
            <p className="text-muted-foreground">Start a collaborative project and find talented teammates</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Tell us about your project idea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input id="title" placeholder="e.g., Campus Food Delivery App" className="text-lg" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe your project, its goals, and what you hope to achieve..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Team & Timeline</CardTitle>
              <CardDescription>Set your team size and project timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="team-size">Team Size *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-3">2-3 people</SelectItem>
                      <SelectItem value="3-5">3-5 people</SelectItem>
                      <SelectItem value="5-7">5-7 people</SelectItem>
                      <SelectItem value="7-10">7-10 people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Expected Duration *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1-month">1 month</SelectItem>
                      <SelectItem value="2-3-months">2-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commitment">Time Commitment *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commitment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual (1-5 hrs/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (5-15 hrs/week)</SelectItem>
                      <SelectItem value="intensive">Intensive (15-25 hrs/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Required */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
              <CardDescription>What skills are needed for this project?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Selected Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="default" className="flex items-center gap-1 bg-orange-500">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer hover:opacity-70" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Available Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border rounded-lg bg-muted/50">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => toggleSkill(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm cursor-pointer font-normal">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Goals & Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Help potential teammates understand your project better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goals">Project Goals</Label>
                <Textarea
                  id="goals"
                  rows={3}
                  placeholder="What are the main objectives and deliverables for this project?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Team Requirements</Label>
                <Textarea id="requirements" rows={3} placeholder="What qualities are you looking for in teammates?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resources">Resources & Tools</Label>
                <Textarea
                  id="resources"
                  rows={2}
                  placeholder="What tools will the team use? (e.g., GitHub, Slack, Figma)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Configure how your project appears to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="public" defaultChecked />
                <Label htmlFor="public">Make this project publicly visible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="applications" defaultChecked />
                <Label htmlFor="applications">Allow applications from other students</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/projects">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
