"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageCircle, LinkIcon, Github, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { projectApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/types"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const data = await projectApi.getProjectById(projectId)
        setProject(data)
      } catch (err) {
        console.error("Error fetching project:", err)
        setError("Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleApplyToJoin = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to apply to projects",
        variant: "destructive",
      })
      return
    }

    setIsApplying(true)
    try {
      await projectApi.requestToJoinProject(projectId)
      toast({
        title: "Success",
        description: "Your application has been sent to the project owner",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to apply to project",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error || "Project not found"}</p>
          <Link href="/projects">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = currentUser?.id === project.ownerId
  const isMember = project.members?.some((m: any) => m.id === currentUser?.id)
  const canApply = !isOwner && !isMember && project.status === "Recruiting"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-800">{project.status}</Badge>
                      <Badge variant="outline">{project.type}</Badge>
                      {project.difficulty && <Badge variant="secondary">{project.difficulty}</Badge>}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base mt-4">{project.description}</CardDescription>
              </CardHeader>
            </Card>

            {/* Details Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.startDate && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {project.endDate && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">End Date</p>
                          <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Team Size</p>
                        <p className="font-medium">
                          {project.members?.length || 0} / {project.maxMembers} members
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Status</p>
                        <p className="font-medium">{project.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {project.requiredSkills && project.requiredSkills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map((rs: any) => (
                      <Badge key={rs.id ?? rs.skillId ?? rs.projectId} variant="secondary">
                        {typeof rs === 'string' ? rs : (rs.skill?.name ?? rs.skill?.title ?? rs.skill ?? JSON.stringify(rs))}
                      </Badge>
                    ))}

                      </div>
                    </CardContent>
                  </Card>
                )}

                {(project.githubUrl || project.liveUrl) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {project.githubUrl && (
                        <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            View on GitHub
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Visit Live Demo
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Leader</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/profile/${project.owner?.id}`}>
                      <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={project.owner?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {project.owner?.firstName?.[0]}
                            {project.owner?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {project.owner?.firstName} {project.owner?.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{project.owner?.department}</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>

                {project.members && project.members.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members ({project.members.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {project.members.map((member: any) => {
                        const user = member.user || member; // Handle both structures
                        return (
                        <Link key={member.id} href={`/profile/${user.id}`}>
                          <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        </Link>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.tasks && project.tasks.length > 0 ? (
                      <div className="space-y-3">
                        {project.tasks.map((task: any) => (
                          <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            <div className="flex-1">
                              <p className="font-medium">{task.title}</p>
                            </div>
                            {task.priority && <Badge variant="outline">{task.priority}</Badge>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No tasks yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Resources will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply/Join Button */}
            {canApply && (
              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleApplyToJoin}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Apply to Join
                  </>
                )}
              </Button>
            )}

            {isOwner && (
              <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled>
                You are the owner
              </Button>
            )}

            {isMember && (
              <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white" disabled>
                You are a member
              </Button>
            )}

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Positions Open</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {Math.max(0, (project.maxMembers || 6) - (project.members?.length || 0))}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Team Members</p>
                  <div className="flex -space-x-2">
                    {project.owner && (
                      <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={project.owner.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {project.owner.firstName?.[0]}
                          {project.owner.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {project.members?.slice(0, 3).map((member: any, idx: number) => {
                      const user = member.user || member; // Handle both structures
                      return (
                      <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      );
                    })}
                    {(project.members?.length || 0) > 3 && (
                      <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarFallback>+{(project.members?.length || 0) - 3}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Lead */}
            <Button variant="outline" className="w-full bg-transparent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Lead
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
