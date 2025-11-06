"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, MessageCircle, Share2, Flag, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(18)

  // Mock post data
  const post = {
    id: postId,
    title: "Looking for React.js Study Group - Fall 2024",
    content:
      "Starting a weekly React study group focusing on hooks, context, and advanced patterns. Meeting Wednesdays 7PM at the library. All skill levels welcome! Looking for 5-10 motivated students who want to learn together.",
    author: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "/female-student-creative.jpg",
      university: "MIT",
      year: "Junior",
      verified: true,
    },
    category: "study-groups",
    timestamp: "2 hours ago",
    likes: 18,
    comments: 12,
    shares: 3,
    tags: ["React", "JavaScript", "Study Group"],
    location: "MIT Library",
    participants: 8,
    maxParticipants: 15,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  }

  const comments = [
    {
      id: 1,
      author: { name: "Alex Johnson", avatar: "/male-student-confident.jpg", university: "MIT" },
      content:
        "I am really interested! What level is this geared towards? I have some React experience but still learning.",
      timestamp: "1 hour ago",
      likes: 2,
      replies: 1,
    },
    {
      id: 2,
      author: { name: "Emma Davis", avatar: "/female-student-thoughtful.jpg", university: "MIT" },
      content: "Sounds great! Are you going to focus on state management libraries like Redux as well?",
      timestamp: "45 minutes ago",
      likes: 1,
      replies: 0,
    },
    {
      id: 3,
      author: { name: "Michael Park", avatar: "/asian-male-student.jpg", university: "MIT" },
      content: "I would love to join this group! Do you have any preference for where we meet?",
      timestamp: "30 minutes ago",
      likes: 0,
      replies: 0,
    },
  ]

  const handleLike = async () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // TODO: Submit comment via API
    } catch (err) {
      console.error("Error submitting comment:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/community">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
                          {post.author.name}
                        </Link>
                        {post.author.verified && <Badge className="text-xs">Verified</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {post.author.university} • {post.author.year} • {post.timestamp}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{post.category.replace("-", " ")}</Badge>
                </div>

                <h1 className="text-3xl font-bold">{post.title}</h1>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-lg text-foreground leading-relaxed">{post.content}</p>

                {/* Post Details */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{post.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="font-medium">
                      {post.participants}/{post.maxParticipants} joined
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleLike}
                      variant="outline"
                      className={liked ? "bg-red-50 text-red-600 border-red-200" : ""}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                      {liked ? "Liked" : "Like"}
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle>Comments ({post.comments})</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-4 pb-6 border-b">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Share your thoughts or ask a question..."
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Posting...
                            </>
                          ) : (
                            "Post Comment"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-2 pb-4 border-b last:border-b-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">{comment.author.university}</span>
                            <span className="text-xs text-muted-foreground">• {comment.timestamp}</span>
                          </div>
                          <p className="text-sm mt-1 text-foreground">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <button className="hover:text-foreground">
                              <Heart className="h-3 w-3 mr-1 inline" />
                              {comment.likes}
                            </button>
                            <button className="hover:text-foreground">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Button */}
            <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Join Study Group
            </Button>

            {/* Post Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Group Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-2xl font-bold text-orange-500">{post.participants}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Slots</p>
                  <p className="text-2xl font-bold">{post.maxParticipants - post.participants}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Post Created</p>
                  <p className="font-medium">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* About Author */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.author.year} at {post.author.university}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/profile/${post.author.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
