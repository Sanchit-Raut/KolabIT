"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { postApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, X, Send, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreatePostPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "",
    subject: "",
    maxMembers: "",
    meetingTime: "",
    location: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    capacity: "",
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const postTypes = [
    { value: "DISCUSSION", label: "Discussion", description: "Ask questions or start conversations" },
    { value: "ANNOUNCEMENT", label: "Announcement", description: "Share important news or updates" },
    { value: "HELP", label: "Help", description: "Request help or guidance from community" },
    { value: "SHOWCASE", label: "Showcase", description: "Share your projects or achievements" },
  ]

  const availableTags = [
    "Study Group",
    "Career",
    "Events",
    "Networking",
    "Tech",
    "Programming",
    "Design",
    "Internship",
    "React",
    "Python",
    "JavaScript",
    "Data Science",
    "Web Development",
  ]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      if (!formData.title.trim() || !formData.content.trim() || !formData.type) {
        setError("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      await postApi.createPost({
        title: formData.title,
        content: formData.content,
        type: formData.type,
        tags: selectedTags,
        subject: formData.subject,
        maxMembers: formData.maxMembers ? Number.parseInt(formData.maxMembers) : undefined,
        meetingTime: formData.meetingTime,
        location: formData.location,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        eventLocation: formData.eventLocation,
        capacity: formData.capacity ? Number.parseInt(formData.capacity) : undefined,
      })

      router.push("/community")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
      console.error("[v0] Error creating post:", err)
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
            <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
            <p className="text-muted-foreground">Share with the community and connect with fellow students</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/community">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
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
          {/* Post Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Post Type</CardTitle>
              <CardDescription>What type of post are you creating?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {postTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 border rounded-lg transition-all text-left hover:shadow-md ${
                      formData.type === type.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-border hover:border-orange-300"
                    }`}
                  >
                    <h3 className="font-medium">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Provide the main information for your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Looking for React.js Study Group"
                  className="text-lg"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Post Content *</Label>
                <Textarea
                  id="content"
                  rows={6}
                  placeholder="Describe your post in detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Study Group Specific */}
          {formData.type === "DISCUSSION" && (
            <Card>
              <CardHeader>
                <CardTitle>Discussion Details</CardTitle>
                <CardDescription>Additional information about your discussion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject/Topic</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., React.js"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-members">Max Members</Label>
                    <Input
                      id="max-members"
                      type="number"
                      placeholder="15"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Meeting Time</Label>
                    <Input
                      id="meeting-time"
                      placeholder="e.g., Wednesdays 7PM"
                      value={formData.meetingTime}
                      onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Library Room 3"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Event Specific */}
          {formData.type === "ANNOUNCEMENT" && (
            <Card>
              <CardHeader>
                <CardTitle>Announcement Details</CardTitle>
                <CardDescription>Information about your announcement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Event Time</Label>
                    <Input
                      id="event-time"
                      placeholder="e.g., 10:00 AM - 4:00 PM"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      placeholder="e.g., Student Center"
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Expected Attendance</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="100"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add relevant tags to help others find your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/community">Cancel</Link>
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
                  <Send className="h-4 w-4 mr-2" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
