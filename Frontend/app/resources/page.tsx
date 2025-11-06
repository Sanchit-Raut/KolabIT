"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, BookOpen, Video, FileText, Code, Download, Heart, Star, Eye, Upload, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "data-science", label: "Data Science" },
    { value: "ai-ml", label: "AI/ML" },
    { value: "web-dev", label: "Web Development" },
    { value: "mobile-dev", label: "Mobile Development" },
  ]

  const resourceTypes = [
    { value: "all", label: "All Types" },
    { value: "tutorial", label: "Tutorials" },
    { value: "template", label: "Templates" },
    { value: "guide", label: "Guides" },
    { value: "cheatsheet", label: "Cheat Sheets" },
  ]

  const featuredResources = [
    {
      id: 1,
      title: "Complete React.js Tutorial Series",
      description: "Comprehensive guide covering React fundamentals to advanced concepts",
      type: "tutorial",
      category: "web-dev",
      author: { name: "Sarah Chen", avatar: "/female-student-creative.jpg", university: "MIT" },
      stats: { views: 2847, downloads: 1205, likes: 342, rating: 4.9 },
      tags: ["React", "JavaScript", "Frontend"],
    },
    {
      id: 2,
      title: "Machine Learning Algorithms Cheat Sheet",
      description: "Visual guide to popular ML algorithms",
      type: "cheatsheet",
      category: "ai-ml",
      author: { name: "David Kumar", avatar: "/asian-male-student-developer.jpg", university: "Stanford" },
      stats: { views: 5234, downloads: 3421, likes: 567, rating: 4.8 },
      tags: ["ML", "Python", "Algorithms"],
    },
    {
      id: 3,
      title: "Modern UI Component Library",
      description: "Reusable React components with Tailwind CSS",
      type: "template",
      category: "design",
      author: { name: "Emma Rodriguez", avatar: "/smiling-female-student.png", university: "Berkeley" },
      stats: { views: 1876, downloads: 892, likes: 234, rating: 4.7 },
      tags: ["React", "Tailwind", "UI/UX"],
    },
  ]

  const trendingResources = [
    {
      id: 4,
      title: "Python Data Analysis Notebook",
      type: "tutorial",
      category: "data-science",
      author: "Alex Thompson",
      views: 1543,
      likes: 189,
      tags: ["Python", "Data"],
    },
    {
      id: 5,
      title: "Web Security Best Practices",
      type: "guide",
      category: "web-dev",
      author: "Maria Santos",
      views: 987,
      likes: 156,
      tags: ["Security", "Web"],
    },
    {
      id: 6,
      title: "Docker Deployment Templates",
      type: "template",
      category: "programming",
      author: "James Wilson",
      views: 2341,
      likes: 298,
      tags: ["Docker", "DevOps"],
    },
  ]

  const recentResources = [
    {
      id: 7,
      title: "Flutter Mobile App Starter Kit",
      type: "template",
      category: "mobile-dev",
      author: "Lisa Park",
      uploadedAt: "2 hours ago",
      tags: ["Flutter", "Mobile"],
    },
    {
      id: 8,
      title: "SQL Query Optimization Guide",
      type: "guide",
      category: "programming",
      author: "Michael Brown",
      uploadedAt: "5 hours ago",
      tags: ["SQL", "Database"],
    },
    {
      id: 9,
      title: "Design System Documentation",
      type: "guide",
      category: "design",
      author: "Sophie Taylor",
      uploadedAt: "1 day ago",
      tags: ["Design", "UI/UX"],
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "tutorial":
        return <BookOpen className="h-4 w-4" />
      case "template":
        return <Code className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Knowledge Sharing Hub</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover tutorials, templates, guides, and tools shared by students
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/resources/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Share
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">2,847</div>
              <div className="text-sm text-muted-foreground">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">156</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">45K+</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="featured" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          {/* Featured Resources */}
          <TabsContent value="featured" className="space-y-6">
            <div className="grid gap-6">
              {featuredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">{resource.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{resource.stats.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resource.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{resource.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{resource.author.name}</div>
                        <div className="text-xs text-muted-foreground">{resource.author.university}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{resource.stats.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{resource.stats.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{resource.stats.likes}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Resources */}
          <TabsContent value="trending" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge variant="secondary" className="text-xs capitalize">
                          {resource.type}
                        </Badge>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">by {resource.author}</p>

                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{resource.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{resource.likes}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Resources */}
          <TabsContent value="recent" className="space-y-4">
            {recentResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge variant="secondary" className="text-xs capitalize">
                          {resource.type}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          by {resource.author} • {resource.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
