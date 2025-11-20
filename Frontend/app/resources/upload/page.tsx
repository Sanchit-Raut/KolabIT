"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, FileText, Code, Loader2, AlertCircle, CheckCircle, Video, Link as LinkIcon, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { resourceApi, tokenManager } from "@/lib/api"

interface UploadFile {
  file: File
  name: string
  size: number
}

export default function UploadResourcePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("")
  const [resourceType, setResourceType] = useState("")
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [articleLinks, setArticleLinks] = useState<{ title: string; url: string }[]>([])
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resourceTypes = [
    { value: "PDF", label: "PDF Document", icon: FileText },
    { value: "DOC", label: "Word Document", icon: FileText },
    { value: "CODE", label: "Code/Archive", icon: Code },
    { value: "VIDEO", label: "YouTube Video", icon: Video },
    { value: "LINK", label: "Article/Link", icon: LinkIcon },
    { value: "MD", label: "Markdown", icon: FileText },
  ]

  const subjects = [
    "Data Structures & Algorithms",
    "DSA",
    "Programming",
    "C Programming",
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "Web Development",
    "Mobile Development",
    "Database Design",
    "DBMS",
    "SQL",
    "AI/Machine Learning",
    "Cloud Computing",
    "DevOps",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "UI/UX Design",
    "Project Management",
    "Mathematics",
    "Discrete Mathematics",
    "Statistics",
  ]

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type - documents and images
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/markdown",
      "text/plain",
      "application/x-zip-compressed",
      "application/zip",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ]

    const extension = file.name.split(".").pop()?.toLowerCase()
    const isAllowedExtension = ["pdf", "doc", "docx", "xls", "xlsx", "md", "txt", "zip", "png", "jpg", "jpeg", "gif", "webp"].includes(extension || "")

    if (!allowedTypes.includes(file.type) && !isAllowedExtension) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, EXCEL, MD, images, or compressed files only.",
        variant: "destructive",
      })
      return
    }

    const maxSize = 40 * 1024 * 1024 // 40MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 40MB.`,
        variant: "destructive",
      })
      return
    }

    setUploadFile({
      file,
      name: file.name,
      size: file.size,
    })

    toast({
      title: "File selected",
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    })
  }

  const removeFile = () => {
    setUploadFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description",
        variant: "destructive",
      })
      return
    }

    if (description.trim().length < 10) {
      toast({
        title: "Error",
        description: "Description must be at least 10 characters long",
        variant: "destructive",
      })
      return
    }

    if (!subject) {
      toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive",
      })
      return
    }

    if (!resourceType) {
      toast({
        title: "Error",
        description: "Please select a resource type",
        variant: "destructive",
      })
      return
    }

    // Require at least one of: file, youtube url, or article links
    if (!uploadFile && !youtubeUrl.trim() && articleLinks.length === 0) {
      toast({
        title: "Error",
        description: "Please upload a file or provide a YouTube URL or at least one article link",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("subject", subject)
      formData.append("type", resourceType)
      if (semester) {
        formData.append("semester", String(Number.parseInt(semester)))
      }
  if (uploadFile) formData.append("file", uploadFile.file)
  if (youtubeUrl.trim()) formData.append("youtubeUrl", youtubeUrl.trim())
  if (articleLinks.length > 0) formData.append("articleLinks", JSON.stringify(articleLinks))

      const apiBase = (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5000";
      const token = tokenManager.getToken() || localStorage.getItem("token") || localStorage.getItem("auth_token")
      if (!token) {
        toast({ title: "Error", description: "You must be logged in to upload resources", variant: "destructive" })
        setIsSubmitting(false)
        return
      }

      const xhr = new XMLHttpRequest();
      const progressToast = toast({
        title: "Uploading...",
        description: "0%",
        duration: 100000, // Long duration
      });

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          progressToast.update({
            description: `${progress}%`,
          });
        }
      };

      // Set up completion handler
      xhr.onload = () => {
        progressToast.dismiss();
        setIsSubmitting(false);
        
        if (xhr.status === 200 || xhr.status === 201) {
          toast({
            title: "Success",
            description: "Resource uploaded successfully",
          });
          setTimeout(() => router.push("/resources"), 1500);
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            toast({
              title: "Error",
              description: error.message || "Failed to upload resource",
              variant: "destructive",
            });
          } catch {
            toast({
              title: "Error",
              description: "Failed to upload resource",
              variant: "destructive",
            });
          }
        }
      };

      // Set up error handler
      xhr.onerror = () => {
        progressToast.dismiss();
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: "Network error occurred while uploading",
          variant: "destructive",
        });
      };

      // Send the request
      xhr.open("POST", `${apiBase}/api/resources`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    } catch (err) {
      setIsSubmitting(false)
      const errorMsg = err instanceof Error ? err.message : "Failed to upload resource"
      console.error("[v0] Error uploading resource:", err)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    }
  }

  const addArticleLink = () => {
    if (!newLinkUrl.trim()) {
      toast({ title: "Error", description: "Please provide a link URL", variant: "destructive" })
      return
    }

    setArticleLinks(prev => [...prev, { title: newLinkTitle || newLinkUrl, url: newLinkUrl }])
    setNewLinkTitle("")
    setNewLinkUrl("")
  }

  const removeArticleLink = (index: number) => {
    setArticleLinks(prev => prev.filter((_, i) => i !== index))
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
            <h1 className="text-3xl font-bold mb-2">Upload Study Resource</h1>
            <p className="text-muted-foreground">Share study materials with fellow students</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/resources">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        {/* File type warning */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-blue-600 text-sm">
              Allowed formats: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), Markdown (MD), Text files, Images (PNG/JPG/GIF/WEBP), or ZIP archives.
              Maximum file size: 40MB.
            </p>
          </CardContent>
        </Card>

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
                <Input
                  id="title"
                  placeholder="e.g., Database Design Best Practices"
                  className="text-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description * (minimum 10 characters)</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe what your resource covers... (min 10 characters)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester (Optional)</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video / Links */}
          <Card>
            <CardHeader>
              <CardTitle>Video & Article Links</CardTitle>
              <CardDescription>Add a YouTube URL or one or more article links (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Article Links</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Link title (optional)"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                  <Input
                    placeholder="https://example.com/article"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <Button type="button" onClick={addArticleLink} variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {articleLinks.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {articleLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="text-sm font-medium">{link.title}</div>
                          <a className="text-xs text-muted-foreground" href={link.url} target="_blank" rel="noreferrer">{link.url}</a>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArticleLink(idx)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Upload your resource file (Max 40MB)</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadFile ? (
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">{uploadFile.name}</p>
                        <p className="text-sm text-green-700">{(uploadFile.size / 1024 / 1024).toFixed(2)}MB</p>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.md,.txt,.zip"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground">PDF, DOC, EXCEL, MD, TXT, or ZIP (Max 40MB)</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/resources">Cancel</Link>
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resource
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
