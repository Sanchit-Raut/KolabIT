"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, MessageCircle, Users, Calendar, MapPin, Heart, Pin, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "announcements", label: "Announcements" },
    { value: "study-groups", label: "Study Groups" },
    { value: "events", label: "Events" },
    { value: "general", label: "General Discussion" },
  ]

  const pinnedPosts = [
    {
      id: 1,
      title: "Welcome to KolabIT Community!",
      content: "Guidelines for posting and community standards. Please read before participating.",
      author: { name: "KolabIT Team", avatar: "/placeholder.svg", role: "Admin" },
      category: "announcements",
      timestamp: "Pinned",
      likes: 234,
      comments: 45,
      isPinned: true,
    },
  ]

  const recentPosts = [
    {
      id: 2,
      title: "Looking for React.js Study Group - Fall 2024",
      content:
        "Starting a weekly React study group focusing on hooks and advanced patterns. Meeting Wednesdays 7PM at the library. All skill levels welcome!",
      author: { name: "Sarah Chen", avatar: "/female-student-creative.jpg", university: "MIT", year: "Junior" },
      category: "study-groups",
      timestamp: "2 hours ago",
      likes: 18,
      comments: 12,
      tags: ["React", "JavaScript", "Study"],
      location: "MIT Library",
      participants: 8,
      maxParticipants: 15,
    },
    {
      id: 3,
      title: "Tech Career Fair - October 15th",
      content:
        "Major tech companies including Google and Microsoft will be recruiting. Bring your resumes and dress professionally!",
      author: { name: "Career Services", avatar: "/placeholder.svg", university: "Stanford", role: "Official" },
      category: "events",
      timestamp: "4 hours ago",
      likes: 89,
      comments: 23,
      tags: ["Career", "Networking"],
      date: "October 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center",
    },
    {
      id: 4,
      title: "Best Study Resources for Machine Learning?",
      content: "New to ML and looking for good resources. Any recommendations for courses, books, or tutorials?",
      author: {
        name: "David Kumar",
        avatar: "/asian-male-student-developer.jpg",
        university: "Stanford",
        year: "Freshman",
      },
      category: "general",
      timestamp: "1 day ago",
      likes: 28,
      comments: 45,
      tags: ["ML", "Resources", "Learning"],
    },
    {
      id: 5,
      title: "Data Science Study Group Starting",
      content:
        "Creating a study group focused on Python, Pandas, and data visualization. Meeting every Tuesday. Join us!",
      author: { name: "Emma Rodriguez", avatar: "/smiling-female-student.png", university: "MIT", year: "Junior" },
      category: "study-groups",
      timestamp: "2 days ago",
      likes: 42,
      comments: 19,
      tags: ["Python", "DataScience", "Study"],
      location: "Library Room 201",
      participants: 12,
      maxParticipants: 20,
    },
  ]

  const trendingTopics = [
    { tag: "Study Groups", count: 23 },
    { tag: "Career", count: 18 },
    { tag: "React", count: 15 },
    { tag: "Python", count: 12 },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "announcements":
        return "bg-blue-100 text-blue-800"
      case "study-groups":
        return "bg-green-100 text-green-800"
      case "events":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const PostCard = ({ post, isPinned }: { post: (typeof recentPosts)[0]; isPinned?: boolean }) => (
    <Card className={isPinned ? "border-orange-200 bg-orange-50" : "hover:shadow-lg transition-shadow"}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.author.name}</span>
                {post.author.role && (
                  <Badge variant="secondary" className="text-xs">
                    {post.author.role}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {post.author.university} {post.author.year && `• ${post.author.year}`} • {post.timestamp}
              </div>
            </div>
          </div>
          <Badge className={getCategoryColor(post.category)}>
            <span className="capitalize">{post.category.replace("-", " ")}</span>
          </Badge>
        </div>

        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4">{post.content}</p>

        {/* Post-specific details */}
        {post.category === "study-groups" && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {post.participants}/{post.maxParticipants} members
              </span>
            </div>
          </div>
        )}

        {post.category === "events" && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{post.location}</span>
            </div>
          </div>
        )}

        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
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
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Bulletin Board</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow students, join study groups, find events, and share opportunities
          </p>

          {/* Search and Filters */}
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

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">1,247</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">89</div>
                <div className="text-sm text-muted-foreground">Study Groups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">156</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">2,341</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Pin className="h-5 w-5 text-orange-500" />
                  Pinned
                </h2>
                {pinnedPosts.map((post) => (
                  <PostCard key={post.id} post={post} isPinned />
                ))}
              </div>
            )}

            {/* Recent Posts */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recent Posts</h2>
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div key={topic.tag} className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{topic.tag}</span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/community/create?type=study-group">
                    <Users className="h-4 w-4 mr-2" />
                    Study Group
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/community/create?type=event">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/community/create">
                    <Plus className="h-4 w-4 mr-2" />
                    General Post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
