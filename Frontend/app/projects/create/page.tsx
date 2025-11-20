"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { projectApi, skillApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X, Loader2, Search, PlusCircle } from "lucide-react"
import Link from "next/link"
import type { Skill } from "@/lib/types"
import { normalizeUrl } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function CreateProjectPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const { toast } = useToast()
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [skillsLoading, setSkillsLoading] = useState(true)
  const [skillSearchQuery, setSkillSearchQuery] = useState("")
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false)
  const [newSkillName, setNewSkillName] = useState("")
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    maxMembers: "",
    startDate: "",
    endDate: "",
    githubUrl: "",
    liveUrl: "",
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setSkillsLoading(true)
        const skillsResponse = await skillApi.getAllSkills()
        const skillsList = skillsResponse?.data || []
        setAvailableSkills(Array.isArray(skillsList) ? skillsList : [])
      } catch (err) {
        console.error("[v0] Error fetching skills:", err)
        setAvailableSkills([])
      } finally {
        setSkillsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const projectTypes = [
    { value: "ACADEMIC", label: "Academic" },
    { value: "PERSONAL", label: "Personal" },
    { value: "COMPETITION", label: "Competition" },
    { value: "INTERNSHIP", label: "Internship" },
  ]

  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds((prev) => (prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]))
  }

  const removeSkill = (skillId: string) => {
    setSelectedSkillIds((prev) => prev.filter((s) => s !== skillId))
  }

  const getSkillName = (skillId: string) => {
    return availableSkills.find((s) => s.id === skillId)?.name || skillId
  }

  const handleAddNewSkill = async () => {
    if (!newSkillName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive",
      })
      return
    }

    setIsAddingSkill(true)
    try {
      const newSkill = await skillApi.createSkill({
        name: newSkillName.trim(),
        category: "TECHNICAL", // Default category
      })
      
      // Add to available skills list
      setAvailableSkills(prev => [...prev, newSkill])
      
      // Auto-select the newly added skill
      setSelectedSkillIds(prev => [...prev, newSkill.id])
      
      toast({
        title: "Success",
        description: `Skill "${newSkillName}" has been added!`,
      })
      
      setNewSkillName("")
      setShowAddSkillDialog(false)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add skill",
        variant: "destructive",
      })
    } finally {
      setIsAddingSkill(false)
    }
  }

  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.type) {
        setError("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      await projectApi.createProject({
        title: formData.title,
        description: formData.description,
        type: formData.type, // ACADEMIC, PERSONAL, COMPETITION, INTERNSHIP
        status: "RECRUITING",
        maxMembers: formData.maxMembers ? Number.parseInt(formData.maxMembers) : undefined,
        requiredSkills: selectedSkillIds,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        githubUrl: normalizeUrl(formData.githubUrl) || undefined,
        liveUrl: normalizeUrl(formData.liveUrl) || undefined,
      })

      router.push("/projects")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
      console.error("[v0] Error creating project:", err)
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

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

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
                <Input
                  id="title"
                  placeholder="e.g., Campus Food Delivery App"
                  className="text-lg"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe your project, its goals, and what you hope to achieve..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Project Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Label htmlFor="max-members">Max Team Members</Label>
                  <Input
                    id="max-members"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.maxMembers}
                    onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
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
              {selectedSkillIds.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Selected Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkillIds.map((skillId) => (
                      <Badge key={skillId} variant="default" className="flex items-center gap-1 bg-orange-500">
                        {getSkillName(skillId)}
                        <X className="h-3 w-3 cursor-pointer hover:opacity-70" onClick={() => removeSkill(skillId)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {skillsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p className="text-sm text-muted-foreground">Loading skills...</p>
                </div>
              ) : (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Available Skills</Label>
                  
                  {/* Skill Search Bar */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border rounded-lg bg-muted/50">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill.id}
                            checked={selectedSkillIds.includes(skill.id)}
                            onCheckedChange={() => toggleSkill(skill.id)}
                          />
                          <Label htmlFor={skill.id} className="text-sm cursor-pointer font-normal">
                            {skill.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-sm text-muted-foreground py-4">
                        No skills found matching "{skillSearchQuery}"
                      </div>
                    )}
                  </div>
                  
                  {/* Add New Skill Link */}
                  <div className="mt-3">
                    {!showAddSkillDialog ? (
                      <button
                        type="button"
                        onClick={() => setShowAddSkillDialog(true)}
                        className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Can't find your skill? Add it
                      </button>
                    ) : (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label htmlFor="new-skill" className="text-sm">New Skill Name</Label>
                          <Input
                            id="new-skill"
                            placeholder="e.g., Machine Learning"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddNewSkill()
                              }
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddNewSkill}
                          disabled={isAddingSkill}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          {isAddingSkill ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowAddSkillDialog(false)
                            setNewSkillName("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
              <CardDescription>Add GitHub or live project links (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Repository URL</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="live">Live Project URL</Label>
                <Input
                  id="live"
                  placeholder="https://..."
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                />
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
