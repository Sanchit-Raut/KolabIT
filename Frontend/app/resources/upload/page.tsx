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
import { ArrowLeft, Upload, X, FileText, Code, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"

export default function UploadResourcePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [resourceType, setResourceType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const availableTags = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Java",
    "C++",
    "UI/UX Design",
    "Figma",
    "Machine Learning",
    "TensorFlow",
    "Data Science",
    "SQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Flutter",
    "React Native",
    "Vue.js",
    "Django",
    "Flask",
  ]

  const resourceTypes = [
    { value: "tutorial", label: "Tutorial", icon: BookOpen },
    { value: "template", label: "Template", icon: Code },
    { value: "guide", label: "Guide", icon: FileText },
    { value: "cheatsheet", label: "Cheat Sheet", icon: FileText },
  ]

  const categories = [
    "Programming",
    "Web Development",
    "Mobile Development",
    "AI/Machine Learning",
    "Data Science",
    "Design",
  ]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // TODO: Call API to upload resource
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/resources")
    } catch (err) {
      console.error("Error uploading resource:", err)
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
            <h1 className="text-3xl font-bold mb-2">Share a Resource</h1>
            <p className="text-muted-foreground">Help fellow students by sharing your knowledge</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/resources">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resource Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Type</CardTitle>
              <CardDescription>What type of resource are you sharing?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resourceTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setResourceType(type.value)}
                      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                        resourceType === type.value
                          ? "border-orange-500 bg-orange-50"
                          : "border-border hover:border-orange-300"
                      }`}
                    >
                      <Icon className="h-8 w-8 mb-2 mx-auto text-orange-500" />
                      <div className="text-center text-sm font-medium">{type.label}</div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
              <CardDescription>Provide information about your resource</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input id="title" placeholder="e.g., Complete React.js Tutorial Series" className="text-lg" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" rows={4} placeholder="Describe what your resource covers..." required />
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
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all-levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Upload your resource files (max 100MB per file)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  <p className="text-sm text-muted-foreground">Supported: PDF, DOC, ZIP, MP4, PNG, JPG</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add relevant tags to help others discover your resource</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Selected Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="default" className="flex items-center gap-1 bg-orange-500">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer hover:opacity-70" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Available Tags</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border rounded-lg bg-muted/50">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox id={tag} checked={selectedTags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                      <Label htmlFor={tag} className="text-sm cursor-pointer font-normal">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Optional details to enhance your resource</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration/Length</Label>
                  <Input id="duration" placeholder="e.g., 2 hours, 50 pages" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Input id="prerequisites" placeholder="e.g., Basic JavaScript knowledge" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learning-outcomes">Learning Outcomes</Label>
                <Textarea id="learning-outcomes" rows={3} placeholder="What will students learn?" />
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
              <CardDescription>Choose how your resource will be shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="public" defaultChecked />
                <Label htmlFor="public">Make this resource publicly available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="comments" defaultChecked />
                <Label htmlFor="comments">Allow comments and feedback</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notifications" defaultChecked />
                <Label htmlFor="notifications">Notify me about downloads and feedback</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/resources">Cancel</Link>
            </Button>
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Publish Resource
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
