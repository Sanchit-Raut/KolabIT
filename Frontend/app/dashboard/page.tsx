"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FolderOpen, MessageCircle, TrendingUp, Award, Clock, Plus, Zap, Loader2, 
  Target, Users, Share2, Heart, Star, Trophy, Sparkles, Medal, GraduationCap, 
  Rocket, Flame, Crown } from "lucide-react"
import Link from "next/link"
import { projectApi, resourceApi, postApi, badgeApi } from "@/lib/api"
import type { Project, Resource, Post } from "@/lib/types"

interface Badge {
  id: string
  name: string
  description: string
  category: string
  iconUrl?: string
  earnedAt: string
  badge?: {
    id: string
    name: string
    description: string
    category: string
    icon?: string
  }
}

// Helper function to get badge icon and color based on badge name or category
const getBadgeIcon = (badgeName: string, category: string) => {
  const name = badgeName.toLowerCase();
  
  // Specific badge icons based on name
  if (name.includes('skill starter') || name.includes('skill master') || name.includes('skill expert')) {
    return { Icon: GraduationCap, color: 'bg-blue-500', bgColor: 'bg-blue-100' };
  }
  if (name.includes('project pioneer') || name.includes('project creator')) {
    return { Icon: Rocket, color: 'bg-purple-500', bgColor: 'bg-purple-100' };
  }
  if (name.includes('active contributor')) {
    return { Icon: Flame, color: 'bg-orange-500', bgColor: 'bg-orange-100' };
  }
  if (name.includes('resource sharer') || name.includes('helper')) {
    return { Icon: Share2, color: 'bg-green-500', bgColor: 'bg-green-100' };
  }
  if (name.includes('community member') || name.includes('discussion starter')) {
    return { Icon: Users, color: 'bg-indigo-500', bgColor: 'bg-indigo-100' };
  }
  if (name.includes('popular') || name.includes('viral')) {
    return { Icon: Heart, color: 'bg-pink-500', bgColor: 'bg-pink-100' };
  }
  
  // Category-based fallbacks
  switch (category.toUpperCase()) {
    case 'SKILL':
      return { Icon: Target, color: 'bg-blue-500', bgColor: 'bg-blue-100' };
    case 'CONTRIBUTION':
      return { Icon: Star, color: 'bg-yellow-500', bgColor: 'bg-yellow-100' };
    case 'ACHIEVEMENT':
      return { Icon: Trophy, color: 'bg-amber-500', bgColor: 'bg-amber-100' };
    case 'SPECIAL':
      return { Icon: Crown, color: 'bg-purple-500', bgColor: 'bg-purple-100' };
    default:
      return { Icon: Award, color: 'bg-orange-500', bgColor: 'bg-orange-100' };
  }
};

// Helper function to calculate time ago
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState<Project[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [communityPostCount, setCommunityPostCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    levelName: "Collaborator",
    pointsToNextLevel: 100,
    currentPoints: 0,
  })

  // Calculate level and points based on total points
  const calculateLevel = (points: number) => {
    let level = 1
    let pointsRequired = 100
    let totalRequired = 0
    
    while (points >= totalRequired + pointsRequired) {
      totalRequired += pointsRequired
      level++
      pointsRequired += 100 // Each level requires 100 more points than the previous
    }
    
    const currentLevelPoints = points - totalRequired
    const nextLevelPoints = pointsRequired
    
    return {
      level,
      levelName: "Collaborator",
      currentPoints: currentLevelPoints,
      pointsToNextLevel: nextLevelPoints,
    }
  }

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated || !user?.id) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("🔍 [DASHBOARD] Starting data fetch for user:", user.id)

        // Fetch user's projects
        const projectsData = await projectApi.getProjectsByUser(user.id)
        const projectsList = Array.isArray(projectsData) ? projectsData : (projectsData as any)?.data || []
        setProjects(projectsList)
        console.log("📁 [DASHBOARD] Projects loaded:", projectsList.length)

        // Fetch user's resources
        const resourcesData = await resourceApi.getResourcesByUser(user.id)
        const resourcesList = Array.isArray(resourcesData) ? resourcesData : (resourcesData as any)?.data || []
        setResources(resourcesList)
        console.log("📚 [DASHBOARD] Resources loaded:", resourcesList.length)

        // Fetch user's community posts - get all posts and filter by user
        try {
          const postsData = await postApi.getPosts({ page: 1, limit: 100 })
          const allPosts = Array.isArray(postsData) ? postsData : (postsData as any)?.data || []
          const userPosts = allPosts.filter((post: Post) => post.authorId === user.id)
          setPosts(userPosts)
          setCommunityPostCount(userPosts.length)
          console.log("💬 [DASHBOARD] Posts loaded:", userPosts.length)
        } catch (err) {
          console.error("❌ [DASHBOARD] Error fetching posts:", err)
          setPosts([])
          setCommunityPostCount(0)
        }

        // Fetch user's badges
        try {
          console.log("🏆 [DASHBOARD] Fetching badges for user:", user.id)
          const badgesData = await badgeApi.getUserBadges(user.id)
          console.log("🏆 [DASHBOARD] Raw badges response:", badgesData)
          
          const badgesList = Array.isArray(badgesData) ? badgesData : (badgesData as any)?.data || []
          console.log("🏆 [DASHBOARD] Processed badges list:", badgesList)
          console.log("🏆 [DASHBOARD] Number of badges:", badgesList.length)
          
          setBadges(badgesList)
          
          if (badgesList.length > 0) {
            console.log("✅ [DASHBOARD] Badge details:")
            badgesList.forEach((badge: Badge, index: number) => {
              console.log(`  ${index + 1}. ${badge.name} (${badge.category}) - Earned: ${badge.earnedAt}`)
            })
          } else {
            console.log("⚠️ [DASHBOARD] No badges found for this user")
          }
        } catch (err) {
          console.error("❌ [DASHBOARD] Error fetching badges:", err)
          console.error("❌ [DASHBOARD] Error details:", JSON.stringify(err, null, 2))
          setBadges([])
        }

        // Calculate level based on activities
        const totalPoints = (projectsList.length * 50) + (resourcesList.length * 30) + (posts.length * 20)
        const levelStats = calculateLevel(totalPoints)
        setStats({
          totalPoints,
          ...levelStats,
        })
        console.log("📊 [DASHBOARD] Stats calculated - Total points:", totalPoints)

        setError("")
      } catch (err) {
        console.error("❌ [DASHBOARD] Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
        console.log("✅ [DASHBOARD] Data fetch completed")
      }
    }

    fetchData()
  }, [isAuthenticated, authLoading, router, user?.id])

  const recentActivity = [
    {
      id: 1,
      type: "project",
      title: projects.length > 0 ? `Working on ${projects[0]?.title || "a project"}` : "No active projects",
      timestamp: projects.length > 0 && projects[0]?.createdAt ? getTimeAgo(projects[0].createdAt) : "N/A",
      icon: FolderOpen,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "resource",
      title: resources.length > 0 ? `Shared ${resources[0]?.title || "a resource"}` : "No resources shared",
      timestamp: resources.length > 0 && resources[0]?.createdAt ? getTimeAgo(resources[0].createdAt) : "N/A",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "community",
      title: posts.length > 0 ? `Posted: ${posts[0]?.title || "Untitled"}` : "No community posts",
      timestamp: posts.length > 0 && posts[0]?.createdAt ? getTimeAgo(posts[0].createdAt) : "N/A",
      icon: MessageCircle,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "skill",
      title: "Keep building your profile",
      timestamp: "ongoing",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-muted-foreground">Here's what's happening in your KolabIT community</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resources Shared</p>
                  <p className="text-2xl font-bold">{resources.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Community Posts</p>
                  <p className="text-2xl font-bold">{communityPostCount}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold">{stats.totalPoints}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="achievements" className="hidden md:flex">
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => {
                        const Icon = activity.icon
                        return (
                          <div key={activity.id} className="flex items-center space-x-3">
                            <Icon className={`h-5 w-5 ${activity.color}`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Your Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500">Level {stats.level}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {stats.currentPoints} / {stats.pointsToNextLevel} points
                        </div>
                      </div>
                      <Progress value={(stats.currentPoints / stats.pointsToNextLevel) * 100} className="w-full" />
                      <div className="text-xs text-muted-foreground text-center">
                        {stats.pointsToNextLevel - stats.currentPoints} points to next level
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Projects</h2>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/projects/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </div>

            {projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/projects/${project.id}`}>View Project</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No projects found. Create your first project!</p>
                  <Button asChild className="bg-orange-500 hover:bg-orange-600">
                    <Link href="/projects/create">Create Project</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Resources</h2>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/resources/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Resource
                </Link>
              </Button>
            </div>

            {resources.length > 0 ? (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{resource.title}</h3>
                          <div className="text-sm text-muted-foreground">{resource.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No resources found. Share your first resource!</p>
                  <Button asChild className="bg-orange-500 hover:bg-orange-600">
                    <Link href="/resources/upload">Upload Resource</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Achievements</h2>
              <Button
                onClick={async () => {
                  console.log("🔄 [MANUAL CHECK] Triggering badge check...");
                  try {
                    const result = await badgeApi.checkBadges();
                    console.log("✅ [MANUAL CHECK] Badge check result:", result);
                    alert(`Badge check complete! ${result.newBadges?.length || 0} new badges earned. Refreshing...`);
                    // Refresh badges
                    const badgesData = await badgeApi.getUserBadges(user.id);
                    const badgesList = Array.isArray(badgesData) ? badgesData : (badgesData as any)?.data || [];
                    setBadges(badgesList);
                    console.log("🔄 [MANUAL CHECK] Badges refreshed:", badgesList.length);
                  } catch (error) {
                    console.error("❌ [MANUAL CHECK] Error:", error);
                    alert("Error checking badges. Check console for details.");
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                Check for New Badges
              </Button>
            </div>
            
            {/* Total Badges Summary */}
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-orange-500">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-orange-900">Total Badges Earned: {badges.length}</h3>
                      <p className="text-sm text-orange-700">Keep contributing to earn more badges!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
                  <p className="text-muted-foreground">Loading achievements...</p>
                </CardContent>
              </Card>
            ) : badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badgeItem) => {
                  // Handle nested badge structure
                  const badgeData = badgeItem.badge || badgeItem;
                  const badgeName = badgeData.name || 'Unknown Badge';
                  const badgeDescription = badgeData.description || 'No description available';
                  const badgeCategory = badgeData.category || 'GENERAL';
                  const earnedDate = badgeItem.earnedAt;
                  
                  // Get appropriate icon and colors
                  const { Icon, color, bgColor } = getBadgeIcon(badgeName, badgeCategory);
                  
                  return (
                    <Card key={badgeItem.id} className="hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-orange-200 relative">
                      {/* Small Award Icon in Top Right */}
                      <div className={`absolute top-3 right-3 p-1.5 rounded-full ${color} shadow-md`}>
                        <Award className="h-3.5 w-3.5 text-white" />
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          {/* Large Icon at Top */}
                          <div className={`p-5 rounded-full ${bgColor} mb-4 shadow-md`}>
                            <Icon className={`h-12 w-12 ${color.replace('bg-', 'text-')}`} />
                          </div>
                          
                          {/* Badge Info */}
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-2">{badgeName}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{badgeDescription}</p>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <span className={`px-3 py-1 rounded-full ${bgColor} ${color.replace('bg-', 'text-')} font-medium`}>
                                {badgeCategory}
                              </span>
                              <span>•</span>
                              <span>{new Date(earnedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No achievements yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You have {projects.length} projects, {resources.length} resources, and {posts.length} posts.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click "Check for New Badges" above to see if you qualify for any badges!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
