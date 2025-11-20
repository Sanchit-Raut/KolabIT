"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { userApi, projectApi, resourceApi, badgeApi } from "@/lib/api"
import type { User, UserSkill, Project, Resource } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, BookOpen, Code, Loader2, MessageCircle, ExternalLink, Award, 
  Target, Users, Share2, Heart, Star, Trophy, Sparkles, Medal, GraduationCap, 
  Rocket, Flame, Crown } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface BadgeItem {
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

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { user: currentUser } = useAuth()
  const { toast } = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [badges, setBadges] = useState<BadgeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await userApi.getUserById(id)
        setUser(userData)

        const skillsData = await userApi.getUserSkills(id)
        setSkills(skillsData || [])

        const projectsData = await projectApi.getProjectsByUser(id)
        setProjects(Array.isArray(projectsData) ? projectsData : projectsData?.data || [])

        const resourcesData = await resourceApi.getResourcesByUser(id)
        setResources(Array.isArray(resourcesData) ? resourcesData : resourcesData?.data || [])

        // Fetch badges
        try {
          const badgesData = await badgeApi.getUserBadges(id)
          const badgesList = Array.isArray(badgesData) ? badgesData : (badgesData as any)?.data || []
          setBadges(badgesList)
        } catch (err) {
          console.error("Error fetching badges:", err)
          setBadges([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [id])

  const isOwnProfile = currentUser?.id === id

  const handleMessage = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to send messages",
        variant: "destructive",
      })
      return
    }

    router.push(`/messages/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-600">{error || "Profile not found"}</p>
          <Link href="/projects">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 mb-4">{user.bio || "No bio added yet"}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  {user.department && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {user.department}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </div>

                <div className="flex gap-3">
                  {isOwnProfile && (
                    <Button asChild className="bg-orange-500 hover:bg-orange-600">
                      <Link href="/profile/edit">Edit Profile</Link>
                    </Button>
                  )}
                  {!isOwnProfile && (
                    <>
                      <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleMessage}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                {skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <Card key={skill.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{skill.skill?.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {skill.proficiency}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{skill.skill?.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {skill.yearsOfExp ? `${skill.yearsOfExp} month${skill.yearsOfExp !== 1 ? 's' : ''}` : "Experience"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No skills added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <h3 className="font-semibold mb-1">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{project.type}</Badge>
                            <Badge className="bg-green-100 text-green-800">{project.status}</Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ExternalLink className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No projects yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Shared Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resources.length > 0 ? (
                  <div className="space-y-3">
                    {resources.map((resource) => (
                      <Link key={resource.id} href={`/resources/${resource.id}`}>
                        <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <h3 className="font-semibold mb-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{resource.type}</Badge>
                            <Badge variant="outline">{resource.subject}</Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No resources shared yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements & Badges
                  </div>
                  <div className="text-sm font-normal text-muted-foreground">
                    {badges.length} badge{badges.length !== 1 ? 's' : ''} earned
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
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
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No badges earned yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start contributing to earn achievements!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
