"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, MessageCircle, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import { postApi } from "@/lib/api"
import type { Post } from "@/lib/types"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "ANNOUNCEMENT", label: "Announcements" },
    { value: "DISCUSSION", label: "Discussions" },
    { value: "HELP", label: "Help" },
    { value: "SHOWCASE", label: "Showcase" },
  ]

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await postApi.getPosts({ limit: 20 })
        const postsList = Array.isArray(response.data) ? response.data : (response.data as any)?.items || []
        setPosts(postsList)
        setError("")
      } catch (err) {
        console.error("[v0] Error fetching posts:", err)
        setError("Failed to load posts")
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = posts
    .filter((post) => selectedCategory === "all" || post.type === selectedCategory)
    .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ANNOUNCEMENT":
        return "bg-blue-100 text-blue-800"
      case "DISCUSSION":
        return "bg-green-100 text-green-800"
      case "HELP":
        return "bg-red-100 text-red-800"
      case "SHOWCASE":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.author?.firstName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {post.author?.firstName} {post.author?.lastName}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <Badge className={getCategoryColor(post.type)}>
            <span className="capitalize">{post.type.replace("-", " ")}</span>
          </Badge>
        </div>

        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4">{post.content}</p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
          >
            <Link href={`/community/${post.id}`}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Bulletin Board</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow students, join study groups, find events, and share opportunities
          </p>

          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts, study groups, events..."
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
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/community/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No posts found</p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/community/create">Create First Post</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
