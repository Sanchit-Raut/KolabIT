"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Loader2, 
  MessageCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  ArrowLeft,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { projectApi, skillApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Project, JoinRequest, Skill } from "@/lib/types"

interface JoinRequestWithDetails extends Omit<JoinRequest, 'user'> {
  user?: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    rollNumber?: string
    department?: string
    skills?: { skillId: string; skill?: Skill }[]
  }
  project?: Project
}

export default function MyJoinRequestsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [allRequests, setAllRequests] = useState<JoinRequestWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("PENDING")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchData()
    }
  }, [user, authLoading, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's owned projects
      const projectsData = await projectApi.getProjectsByUser(user!.id) as Project[]
      const ownedProjects = projectsData?.filter((p: Project) => p.ownerId === user!.id) || []
      setMyProjects(ownedProjects)

      // Fetch join requests for each project
      const allJoinRequests: JoinRequestWithDetails[] = []
      for (const project of ownedProjects) {
        try {
          const requests = await projectApi.getJoinRequests(project.id) as any[] || []
          
          // Enhance requests with user skills
          for (const request of requests) {
            if (request.user?.id) {
              try {
                const userSkills = await skillApi.getUserSkills(request.user.id)
                console.log('[DEBUG] User skills response:', userSkills)
                console.log('[DEBUG] Is array?', Array.isArray(userSkills))
                request.user.skills = Array.isArray(userSkills) ? userSkills : []
              } catch (err) {
                console.warn('Failed to fetch user skills:', err)
                request.user.skills = []
              }
            }
            request.project = project
          }
          
          allJoinRequests.push(...requests)
        } catch (err) {
          console.error(`Failed to fetch join requests for project ${project.id}:`, err)
        }
      }

      setAllRequests(allJoinRequests)
    } catch (err) {
      console.error("Error fetching data:", err)
      toast({
        title: "Error",
        description: "Failed to load join requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateMatchedSkills = (request: JoinRequestWithDetails) => {
    if (!request.user?.skills || !request.project?.requiredSkills) {
      return { count: 0, matched: [] }
    }

    // Ensure skills is an array
    const skills = Array.isArray(request.user.skills) ? request.user.skills : []
    if (skills.length === 0) {
      return { count: 0, matched: [] }
    }

    const userSkillIds = skills.map(us => us.skillId)
    const matched = request.project.requiredSkills.filter(rs => 
      userSkillIds.includes(rs.skillId)
    )
    
    return { count: matched.length, matched }
  }

  const handleApprove = async (request: JoinRequestWithDetails) => {
    if (!request.project) return

    try {
      await projectApi.updateJoinRequest(request.projectId, request.id, "ACCEPTED")
      
      // Check if project is now full
      const currentMembers = request.project.members?.length || 0
      const maxMembers = request.project.maxMembers || 0
      
      if (maxMembers > 0 && currentMembers + 1 >= maxMembers) {
        toast({
          title: "Request Approved",
          description: "Project is now full and has been closed automatically",
        })
      } else {
        toast({
          title: "Success",
          description: "Join request approved successfully",
        })
      }
      
      fetchData() // Refresh data
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to approve request",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (request: JoinRequestWithDetails) => {
    try {
      await projectApi.updateJoinRequest(request.projectId, request.id, "REJECTED")
      toast({
        title: "Success",
        description: "Join request rejected",
      })
      fetchData() // Refresh data
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to reject request",
        variant: "destructive",
      })
    }
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const filteredRequests = allRequests
    .filter(r => selectedProject === "all" || r.projectId === selectedProject)
    .filter(r => activeTab === "all" || r.status === activeTab)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "ACCEPTED":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Join Requests Management</h1>
            <p className="text-muted-foreground">Review and manage join requests for your projects</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {myProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="PENDING">
              Pending ({allRequests.filter(r => r.status === "PENDING" && (selectedProject === "all" || r.projectId === selectedProject)).length})
            </TabsTrigger>
            <TabsTrigger value="ACCEPTED">
              Accepted ({allRequests.filter(r => r.status === "ACCEPTED" && (selectedProject === "all" || r.projectId === selectedProject)).length})
            </TabsTrigger>
            <TabsTrigger value="REJECTED">
              Rejected ({allRequests.filter(r => r.status === "REJECTED" && (selectedProject === "all" || r.projectId === selectedProject)).length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({filteredRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No join requests found</p>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => {
                const matchedSkills = calculateMatchedSkills(request)
                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
                              {request.project?.title}
                            </CardTitle>
                            {getStatusBadge(request.status)}
                          </div>
                          <CardDescription>
                            {getRelativeTime(request.createdAt)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.user?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {request.user?.firstName?.[0]}
                            {request.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {request.user?.firstName} {request.user?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.user?.rollNumber && `${request.user.rollNumber} • `}
                            {request.user?.department || "No department"}
                          </div>
                        </div>
                      </div>

                      {/* Skill Matching */}
                      {request.project?.requiredSkills && request.project.requiredSkills.length > 0 && (
                        <div className="border-t pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">
                              Skills Match: {matchedSkills.count} / {request.project.requiredSkills.length}
                            </span>
                          </div>
                          {matchedSkills.matched.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {matchedSkills.matched.map((rs: any) => (
                                <Badge key={rs.id} className="bg-green-100 text-green-800">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  {rs.skill?.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Request Message */}
                      {request.message && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-1">Message:</p>
                          <p className="text-sm text-muted-foreground">{request.message}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="border-t pt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/messages/${request.user?.id}`)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        
                        {request.status === "PENDING" && (
                          <>
                            <Button 
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleApprove(request)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
