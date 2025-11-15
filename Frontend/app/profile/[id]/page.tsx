"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { userApi, projectApi, resourceApi } from "@/lib/api"
import type { User, UserSkill, Project, Resource } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, BookOpen, Code, Loader2, MessageCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [id])

  const isOwnProfile = currentUser?.id === id

  const handleMessage = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to send messages",
        variant: "destructive",
      })
      return
    }

    try {
      await userApi.sendMessage(id, "Hi! I'd like to connect with you.")
      toast({
        title: "Success",
        description: "Message sent successfully",
      })
    } catch (err) {
      console.error("[v0] Error sending message:", err)
      toast({
        title: "Error",
        description: "Failed to send message",
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
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
                              {skill.yearsOfExp ? `${skill.yearsOfExp} years` : "Experience"}
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
                      <div key={resource.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h3 className="font-semibold mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{resource.type}</Badge>
                          <Badge variant="outline">{resource.subject}</Badge>
                        </div>
                      </div>
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
        </Tabs>
      </div>
    </div>
  )
}
