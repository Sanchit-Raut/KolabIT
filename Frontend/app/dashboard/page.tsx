"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  Users,
  FolderOpen,
  MessageCircle,
  TrendingUp,
  Award,
  Clock,
  Plus,
  ArrowRight,
  Target,
  Zap,
  Heart,
  Eye,
  Download,
  Loader2,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const userStats = {
    skillsShared: 12,
    projectsJoined: 5,
    resourcesShared: 8,
    communityPosts: 15,
    totalPoints: 2847,
    level: "Advanced Collaborator",
    nextLevelPoints: 3000,
  }

  const recentActivity = [
    {
      id: 1,
      type: "project",
      title: "Joined 'Campus Food Delivery App' project",
      timestamp: "2 hours ago",
      icon: FolderOpen,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "resource",
      title: "Shared 'React Hooks Tutorial'",
      timestamp: "5 hours ago",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "community",
      title: "Posted in Study Groups",
      timestamp: "1 day ago",
      icon: MessageCircle,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "skill",
      title: "Updated Python proficiency to Expert",
      timestamp: "2 days ago",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  const activeProjects = [
    {
      id: 1,
      title: "Campus Food Delivery App",
      description: "Mobile app for ordering food from campus restaurants",
      progress: 65,
      role: "Frontend Developer",
      team: [
        { name: "Sarah Chen", avatar: "/female-student-creative.jpg" },
        { name: "David Kumar", avatar: "/asian-male-student-developer.jpg" },
        { name: "Emma Rodriguez", avatar: "/smiling-female-student.png" },
      ],
      deadline: "Nov 15, 2024",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Study Group Finder",
      description: "Platform to help students find and join study groups",
      progress: 30,
      role: "UI/UX Designer",
      team: [
        { name: "Alex Thompson", avatar: "/asian-male-student-developer.jpg" },
        { name: "Maria Santos", avatar: "/placeholder.svg" },
      ],
      deadline: "Dec 1, 2024",
      status: "Planning",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "React.js Study Group",
      date: "Today, 7:00 PM",
      location: "Library Room 3",
      type: "Study Group",
      attendees: 12,
    },
    {
      id: 2,
      title: "Tech Career Fair",
      date: "Oct 15, 10:00 AM",
      location: "Student Center",
      type: "Event",
      attendees: 234,
    },
    {
      id: 3,
      title: "AI/ML Workshop",
      date: "Oct 18, 2:00 PM",
      location: "CS Building",
      type: "Workshop",
      attendees: 45,
    },
  ]

  const achievements = [
    {
      id: 1,
      title: "First Project",
      description: "Completed your first collaborative project",
      icon: Award,
      earned: true,
      date: "Sep 15, 2024",
    },
    {
      id: 2,
      title: "Knowledge Sharer",
      description: "Shared 10+ resources with the community",
      icon: BookOpen,
      earned: true,
      date: "Oct 2, 2024",
    },
    {
      id: 3,
      title: "Community Leader",
      description: "Created 5+ community posts",
      icon: Users,
      earned: true,
      date: "Oct 8, 2024",
    },
    {
      id: 4,
      title: "Skill Master",
      description: "Reach expert level in 3+ skills",
      icon: Target,
      earned: false,
      progress: 67,
    },
  ]

  const myResources = [
    {
      id: 1,
      title: "Complete React.js Tutorial",
      type: "Tutorial",
      views: 1247,
      likes: 89,
      downloads: 234,
      uploadDate: "Sep 20, 2024",
    },
    {
      id: 2,
      title: "Python Data Analysis Notebook",
      type: "Template",
      views: 856,
      likes: 67,
      downloads: 145,
      uploadDate: "Oct 1, 2024",
    },
    {
      id: 3,
      title: "UI Design System Components",
      type: "Template",
      views: 623,
      likes: 45,
      downloads: 89,
      uploadDate: "Oct 5, 2024",
    },
  ]

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
                  <p className="text-2xl font-bold">{activeProjects.length}</p>
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
                  <p className="text-2xl font-bold">{userStats.resourcesShared}</p>
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
                  <p className="text-2xl font-bold">{userStats.communityPosts}</p>
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
                  <p className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
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

              {/* Level Progress */}
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
                        <div className="text-2xl font-bold text-orange-500">{userStats.level}</div>
                        <div className="text-sm text-muted-foreground">
                          {userStats.totalPoints} / {userStats.nextLevelPoints} points
                        </div>
                      </div>
                      <Progress value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} className="w-full" />
                      <div className="text-xs text-muted-foreground text-center">
                        {userStats.nextLevelPoints - userStats.totalPoints} points to next level
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/community?category=events">
                      View All
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {event.date} • {event.location}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

            <div className="grid md:grid-cols-2 gap-6">
              {activeProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-medium">{project.role}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium">{project.deadline}</span>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Team Members</div>
                        <div className="flex -space-x-2">
                          {project.team.map((member, index) => (
                            <Avatar key={index} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/projects/${project.id}`}>View Project</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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

            <div className="space-y-4">
              {myResources.map((resource) => (
                <Card key={resource.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{resource.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Uploaded on {resource.uploadDate}</div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{resource.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{resource.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{resource.downloads}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-2xl font-bold">Achievements</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card key={achievement.id} className={achievement.earned ? "border-orange-200 bg-orange-50" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-lg ${
                            achievement.earned ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                          {achievement.earned && (
                            <Badge variant="default" className="text-xs bg-orange-500">
                              Earned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
            </div>

            <div className="space-y-4">{/* Notifications data would go here */}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
