"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, MessageCircle, Flag, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { postApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Post, Comment } from "@/lib/types"

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [commentContent, setCommentContent] = useState("")

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true)
        const postData = await postApi.getPostById(postId)
        setPost(postData)

        if (postData?.likes && currentUser?.id) {
          const userLiked = postData.likes.some((like: any) => like.userId === currentUser.id)
          setLiked(userLiked)
        }
        setLikes(postData?.likes?.length || 0)

        const commentsData = await postApi.getPostComments(postId)
        setComments(Array.isArray(commentsData) ? commentsData : commentsData?.data || [])
      } catch (err) {
        console.error("[v0] Error fetching post:", err)
        setError("Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPostData()
  }, [postId, currentUser?.id])

  const handleLike = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await postApi.likePost(postId)
      if (response.liked !== undefined) {
        setLiked(response.liked)
        setLikes(response.liked ? likes + 1 : likes - 1)
      }
      toast({
        title: "Success",
        description: response.message,
      })
    } catch (err) {
      console.error("[v0] Error liking post:", err)
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      })
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!commentContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const newComment = await postApi.addComment(postId, commentContent)
      // Add the new comment to the list
      if (newComment) {
        setComments([...comments, newComment])
        setCommentContent("")
        toast({
          title: "Success",
          description: "Comment posted successfully",
        })
      }
    } catch (err) {
      console.error("[v0] Error submitting comment:", err)
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-600">{error || "Post not found"}</p>
          <Link href="/community">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Back to Community</Button>
          </Link>
        </div>
      </div>
    )
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
                      <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author?.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${post.author?.id}`} className="font-semibold hover:underline">
                          {post.author?.firstName} {post.author?.lastName}
                        </Link>
                        {post.author?.isVerified && <Badge className="text-xs">Verified</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {post.author?.department || "Student"} • {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{post.type || "General"}</Badge>
                </div>

                <h1 className="text-3xl font-bold">{post.title}</h1>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-lg text-foreground leading-relaxed">{post.content}</p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{comments.length}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleLike}
                      variant="outline"
                      className={liked ? "bg-red-50 text-red-600 border-red-200" : ""}
                      disabled={!currentUser}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                      {liked ? "Liked" : "Like"}
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
                <CardTitle>Comments ({comments.length})</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-4 pb-6 border-b">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{currentUser?.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Share your thoughts or ask a question..."
                        rows={3}
                        className="resize-none"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        disabled={!currentUser}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !currentUser || !commentContent.trim()}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
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
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment: Comment) => (
                      <div key={comment.id} className="space-y-2 pb-4 border-b last:border-b-0">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{comment.author?.firstName?.[0] || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {comment.author?.firstName} {comment.author?.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1 text-foreground">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Likes</p>
                  <p className="text-2xl font-bold text-orange-500">{likes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comments</p>
                  <p className="text-2xl font-bold">{comments.length}</p>
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
                <CardTitle className="text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {post.author?.firstName} {post.author?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{post.author?.department || "Student"}</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/profile/${post.author?.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
