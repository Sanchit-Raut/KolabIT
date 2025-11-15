"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Heart, Star, Upload, Loader2, FileText, Video, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { resourceApi } from "@/lib/api"
import type { Resource } from "@/lib/types"

export default function ResourcesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Get unique subjects and types from resources
  const subjects = ["all", ...new Set(resources.map(r => r.subject).filter(Boolean))]
  const types = ["all", ...new Set(resources.map(r => r.type).filter(Boolean))]

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const data = await resourceApi.getResources({ limit: 50 })
        // Handle both array and paginated response
        const resourcesList = Array.isArray(data) ? data : (data?.data || [])
        setResources(resourcesList)
        setError("")
      } catch (err) {
        console.error("[v0] Error fetching resources:", err)
        setError("Failed to load resources")
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const filteredResources = resources
    .filter((r) => selectedSubject === "all" || r.subject === selectedSubject)
    .filter((r) => selectedType === "all" || r.type === selectedType)
    .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const calculateAverageRating = (resource: Resource) => {
    if (!resource.ratings || resource.ratings.length === 0) return 0
    const sum = resource.ratings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / resource.ratings.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Knowledge Sharing Hub</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover tutorials, templates, guides, and tools shared by students
          </p>

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
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject === "all" ? "All Subjects" : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
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
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : filteredResources.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No resources found</p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/resources/upload">Upload First Resource</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredResources.map((resource) => (
              <Card 
                key={resource.id} 
                className="hover:shadow-lg transition-all cursor-pointer hover:border-orange-300"
                onClick={() => router.push(`/resources/${resource.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl hover:text-orange-600 transition-colors">
                          {resource.title}
                        </CardTitle>
                        {resource.semester && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            Sem {resource.semester}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                      
                      {/* Content Type Indicators */}
                      <div className="flex items-center gap-2 mt-3">
                        {resource.fileUrl && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            File
                          </Badge>
                        )}
                        {resource.youtubeUrl && (
                          <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        )}
                        {resource.articleLinks && resource.articleLinks.length > 0 && (
                          <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {resource.articleLinks.length} Link{resource.articleLinks.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{calculateAverageRating(resource)}</span>
                      <span className="text-muted-foreground text-xs ml-1">
                        ({resource.ratings?.length || 0})
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={resource.uploader?.avatar} />
                      <AvatarFallback>
                        {resource.uploader?.firstName?.[0]}{resource.uploader?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {resource.uploader?.firstName} {resource.uploader?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {resource.uploader?.department} • {new Date(resource.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{resource.downloads || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{resource.likes || 0}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/resources/${resource.id}`)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
