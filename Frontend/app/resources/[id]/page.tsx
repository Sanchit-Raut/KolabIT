"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Download, 
  Heart, 
  Star, 
  Loader2,
  ExternalLink,
  User,
  Calendar,
  FileText,
  Video,
  Link as LinkIcon,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { resourceApi } from "@/lib/api"
import type { Resource } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const resourceId = params.id as string

  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)

  useEffect(() => {
    if (resourceId) {
      fetchResource()
    }
  }, [resourceId])

  const fetchResource = async () => {
    try {
      setLoading(true)
      const data = await resourceApi.getResourceById(resourceId)
      setResource(data)
      setLikeCount(data.likes || 0)
      setIsLiked((data as any).isLiked || false) // Backend returns isLiked
      
      setError("")
    } catch (err) {
      console.error("[v0] Error fetching resource:", err)
      setError("Failed to load resource")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to like resources",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await resourceApi.toggleLike(resourceId)
      setIsLiked(result.liked)
      setLikeCount(result.likes)

      toast({
        title: result.liked ? "Liked!" : "Unliked",
        description: result.liked ? "Resource added to your favorites" : "Resource removed from favorites",
      })
    } catch (err) {
      console.error("[v0] Error toggling like:", err)
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    }
  }

  const handleRatingSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to rate resources",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingRating(true)
    try {
      await resourceApi.rateResource(resourceId, { rating, review: review.trim() || undefined })
      toast({
        title: "Success",
        description: "Your rating has been submitted",
      })
      setRating(0)
      setReview("")
      fetchResource() // Refresh to show new rating
    } catch (err) {
      console.error("[v0] Error submitting rating:", err)
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingRating(false)
    }
  }

  const handleDownload = async () => {
    if (resource?.fileUrl) {
      try {
        await resourceApi.trackDownload(resourceId)
        // Open backend URL for download
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        window.open(`${API_BASE_URL}${resource.fileUrl}`, "_blank")
      } catch (err) {
        console.error("[v0] Error tracking download:", err)
      }
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return
    }

    try {
      await resourceApi.deleteResource(resourceId)
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      })
      router.push("/resources")
    } catch (err) {
      console.error("[v0] Error deleting resource:", err)
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      })
    }
  }

  const getYouTubeEmbed = (url?: string) => {
    if (!url) return null
    const regex = /(?:v=|be\/|embed\/)([A-Za-z0-9_-]{11})/
    const m = url.match(regex)
    const id = m ? m[1] : null
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  const normalizeUrl = (url?: string) => {
    if (!url) return ""
    // If URL already has protocol, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url
    }
    // Otherwise, add https://
    return `https://${url}`
  }

  const calculateAverageRating = () => {
    if (!resource?.ratings || resource.ratings.length === 0) return 0
    const sum = resource.ratings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / resource.ratings.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading resource...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-red-600 mb-4">{error || "Resource not found"}</p>
              <Button onClick={() => router.push("/resources")}>Back to Resources</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const embedUrl = getYouTubeEmbed(resource.youtubeUrl)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/resources")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>

        {/* Resource Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{resource.title}</CardTitle>
                <CardDescription className="text-base">{resource.description}</CardDescription>
                
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{resource.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                  {resource.semester && (
                    <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      Semester {resource.semester}
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Display */}
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span>{calculateAverageRating()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {resource.ratings?.length || 0} ratings
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Author Info */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={resource.uploader?.avatar} />
                  <AvatarFallback>
                    {resource.uploader?.firstName?.[0]}{resource.uploader?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {resource.uploader?.firstName} {resource.uploader?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resource.uploader?.department} • {resource.uploader?.rollNumber}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/profile/${resource.uploaderId}`}>
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{resource.downloads || 0} downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span>{likeCount} likes</span>
              </div>
            </div>

            {/* Resource Links Section - YouTube and Article URLs */}
            {(resource.youtubeUrl || (resource.articleLinks && resource.articleLinks.length > 0)) && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <h3 className="font-semibold text-sm mb-3 text-blue-900">📎 Resource Links</h3>
                <div className="space-y-2">
                  {resource.youtubeUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <a
                        href={normalizeUrl(resource.youtubeUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {resource.youtubeUrl}
                      </a>
                    </div>
                  )}
                  {resource.articleLinks && resource.articleLinks.map((link: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <a
                        href={normalizeUrl(link.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {link.title || link.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {resource.fileUrl && (
                <Button onClick={handleDownload} className="bg-orange-500 hover:bg-orange-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              )}
              <Button
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-white" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </Button>
              
              {/* Delete Button - Only show if user is the owner */}
              {user && user.id === resource.uploaderId && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="ml-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* YouTube Video */}
        {embedUrl && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-red-600" />
                Video Tutorial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={embedUrl}
                  title={resource.title}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Article Links */}
        {resource.articleLinks && resource.articleLinks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Related Articles & Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(resource.articleLinks as any[]).map((link: any, index: number) => (
                  <a
                    key={index}
                    href={normalizeUrl(link.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-orange-600 transition-colors">
                          {link.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rate This Resource */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rate This Resource</CardTitle>
              <CardDescription>Share your experience with this resource</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoveredStar || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      {rating} {rating === 1 ? "star" : "stars"}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Review (Optional)</label>
                  <Textarea
                    placeholder="Share your thoughts about this resource..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleRatingSubmit}
                  disabled={isSubmittingRating || rating === 0}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmittingRating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Rating"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Ratings */}
        {resource.ratings && resource.ratings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({resource.ratings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resource.ratings.map((ratingItem) => (
                  <div key={ratingItem.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={ratingItem.user?.avatar} />
                        <AvatarFallback>
                          {ratingItem.user?.firstName?.[0]}{ratingItem.user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">
                            {ratingItem.user?.firstName} {ratingItem.user?.lastName}
                          </p>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < ratingItem.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {ratingItem.review && (
                          <p className="text-sm text-muted-foreground">{ratingItem.review}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
