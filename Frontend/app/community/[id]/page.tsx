"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, MessageCircle, Flag, Loader2, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { postApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Post, Comment } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      await postApi.deletePost(postId)
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
      router.push("/community")
    } catch (err) {
      console.error("[v0] Error deleting post:", err)
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = () => {
    setEditFormData({
      title: post?.title || "",
      content: post?.content || "",
    })
    setIsEditModalOpen(true)
  }

  const handleUpdatePost = async () => {
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const updatedPost = await postApi.updatePost(postId, editFormData)
      setPost(updatedPost)
      setIsEditModalOpen(false)
      toast({
        title: "Success",
        description: "Post updated successfully",
      })
    } catch (err) {
      console.error("[v0] Error updating post:", err)
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      await postApi.deleteComment(postId, commentId)
      setComments(comments.filter((c) => c.id !== commentId))
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (err) {
      console.error("[v0] Error deleting comment:", err)
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
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
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">{post.type || "General"}</Badge>
                    {currentUser && currentUser.id === post.author?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditClick}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
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
                    
                    {/* Delete Button - Only show if user is the author */}
                    {currentUser && currentUser.id === post.author?.id && (
                      <Button
                        variant="destructive"
                        onClick={handleDeletePost}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                      </Button>
                    )}
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {comment.author?.firstName} {comment.author?.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  • {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {currentUser && currentUser.id === comment.userId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
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

      {/* Edit Post Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                placeholder="Enter post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={editFormData.content}
                onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                placeholder="Enter post content"
                rows={8}
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePost}
              disabled={isUpdating || !editFormData.title.trim() || !editFormData.content.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
