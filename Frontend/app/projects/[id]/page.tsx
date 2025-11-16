"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  MessageCircle, 
  LinkIcon, 
  Github, 
  Loader2, 
  Users, 
  Calendar, 
  Clock,
  Edit,
  FileText,
  Download,
  Eye,
  Heart,
  CheckCircle2,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { projectApi, skillApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Project, Skill, JoinRequest } from "@/lib/types"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userSkills, setUserSkills] = useState<Skill[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [joinRequest, setJoinRequest] = useState<JoinRequest | null>(null)
  const [projectResources, setProjectResources] = useState<any[]>([])
  
  // Modal states
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinMessage, setJoinMessage] = useState("")
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false)
  
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    maxMembers: "",
    startDate: "",
    endDate: "",
    githubUrl: "",
    liveUrl: "",
    status: "",
    requiredSkills: [] as string[],
  })
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchProject()
      fetchProjectResources()
    }
  }, [projectId])

  useEffect(() => {
    if (currentUser) {
      fetchUserSkills()
      checkJoinRequestStatus()
    }
  }, [currentUser, projectId])

  useEffect(() => {
    fetchAllSkills()
  }, [])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const data = await projectApi.getProjectById(projectId)
      setProject(data)
      setError("")
    } catch (err) {
      console.error("Error fetching project:", err)
      setError("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSkills = async () => {
    if (!currentUser) return
    try {
      const skills = await skillApi.getUserSkills(currentUser.id)
      setUserSkills(skills?.data || [])
    } catch (err) {
      console.error("Error fetching user skills:", err)
    }
  }

  const fetchAllSkills = async () => {
    try {
      const skills = await skillApi.getAllSkills()
      setAllSkills(skills?.data || [])
    } catch (err) {
      console.error("Error fetching skills:", err)
    }
  }

  const checkJoinRequestStatus = async () => {
    if (!currentUser) return
    try {
      const requests = await projectApi.getMyJoinRequests()
      const myRequest = requests?.data?.find((r: JoinRequest) => r.projectId === projectId)
      setJoinRequest(myRequest || null)
    } catch (err) {
      console.error("Error checking join request:", err)
    }
  }

  const fetchProjectResources = async () => {
    try {
      const resources = await projectApi.getProjectResources(projectId)
      setProjectResources(resources?.data || [])
    } catch (err) {
      console.error("Error fetching project resources:", err)
    }
  }

  const calculateMatchedSkills = () => {
    if (!currentUser || !userSkills.length || !project?.requiredSkills?.length) {
      return { count: 0, matched: [], unmatched: [] }
    }

    const userSkillIds = userSkills.map(us => us.skillId)
    const requiredSkillIds = project.requiredSkills.map(rs => rs.skillId)
    
    const matched = project.requiredSkills.filter(rs => userSkillIds.includes(rs.skillId))
    const unmatched = project.requiredSkills.filter(rs => !userSkillIds.includes(rs.skillId))
    
    return { count: matched.length, matched, unmatched }
  }

  const handleJoinRequest = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to apply to projects",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setShowJoinModal(true)
  }

  const submitJoinRequest = async () => {
    if (joinMessage.length > 500) {
      toast({
        title: "Error",
        description: "Message must be 500 characters or less",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingJoin(true)
    try {
      await projectApi.requestToJoinProject(projectId, joinMessage.trim() || undefined)
      toast({
        title: "Success",
        description: "Your request has been sent to the project owner",
      })
      setShowJoinModal(false)
      setJoinMessage("")
      checkJoinRequestStatus()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to send request",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingJoin(false)
    }
  }

  const openEditModal = () => {
    if (!project) return
    
    setEditFormData({
      title: project.title,
      description: project.description,
      maxMembers: project.maxMembers?.toString() || "",
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      status: project.status,
      requiredSkills: project.requiredSkills?.map(rs => rs.skillId) || [],
    })
    setShowEditModal(true)
  }

  const submitProjectEdit = async () => {
    if (!project) return

    const currentMemberCount = project.members?.length || 0
    const newMaxMembers = parseInt(editFormData.maxMembers)

    if (newMaxMembers && newMaxMembers < currentMemberCount) {
      toast({
        title: "Error",
        description: `Max members cannot be less than current member count (${currentMemberCount})`,
        variant: "destructive",
      })
      return
    }

    setIsSubmittingEdit(true)
    try {
      await projectApi.updateProject(projectId, {
        title: editFormData.title,
        description: editFormData.description,
        maxMembers: newMaxMembers || undefined,
        startDate: editFormData.startDate || undefined,
        endDate: editFormData.endDate || undefined,
        githubUrl: editFormData.githubUrl || undefined,
        liveUrl: editFormData.liveUrl || undefined,
        status: editFormData.status,
        requiredSkills: editFormData.requiredSkills.map(skillId => ({ skillId, required: true })),
      })
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      })
      setShowEditModal(false)
      fetchProject()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  const toggleSkill = (skillId: string) => {
    setEditFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skillId)
        ? prev.requiredSkills.filter(id => id !== skillId)
        : [...prev.requiredSkills, skillId]
    }))
  }

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case "recruiting":
        return "bg-green-100 text-green-800"
      case "active":
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "closed":
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case "MAINTAINER":
        return "bg-blue-100 text-blue-800"
      case "COLLABORATOR":
        return "bg-purple-100 text-purple-800"
      case "MEMBER":
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
  const isMember = project.members?.some((m: any) => m.userId === currentUser?.id)
  const currentMemberCount = project.members?.length || 0
  const maxMembers = project.maxMembers || 0
  const isProjectFull = maxMembers > 0 && currentMemberCount >= maxMembers
  const isProjectClosed = project.status?.toUpperCase() === "CLOSED" || project.status?.toUpperCase() === "CANCELLED"
  const hasPendingRequest = joinRequest?.status === "PENDING"
  const canRequestToJoin = !isOwner && !isMember && !hasPendingRequest && !isProjectFull && !isProjectClosed

  const matchedSkills = calculateMatchedSkills()

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
                    <CardTitle className="text-2xl mb-3">{project.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(project.status)}>{project.status || "Open"}</Badge>
                      <Badge variant="outline">{project.type || "Project"}</Badge>
                      {isProjectFull && <Badge className="bg-red-100 text-red-800">FULL</Badge>}
                    </div>
                  </div>
                  {isOwner && (
                    <Button size="sm" variant="outline" onClick={openEditModal}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
                <CardDescription className="text-base mt-4">{project.description}</CardDescription>
              </CardHeader>
            </Card>

            {/* Skill Matching Display */}
            {currentUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Skill Match</CardTitle>
                </CardHeader>
                <CardContent>
                  {!project.requiredSkills || project.requiredSkills.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No specific skills required for this project</p>
                  ) : !userSkills || userSkills.length === 0 ? (
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-2">Add skills to your profile to see matches</p>
                      <Button size="sm" variant="outline" onClick={() => router.push("/profile")}>
                        Add Skills
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{matchedSkills.count} Skills Matched</span>
                        <span className="text-sm text-muted-foreground">
                          / {project.requiredSkills.length} required
                        </span>
                      </div>
                      
                      {matchedSkills.matched.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Matched Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {matchedSkills.matched.map(rs => (
                              <Badge key={rs.id} className="bg-green-100 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {rs.skill?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {matchedSkills.unmatched.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Skills Needed:</p>
                          <div className="flex flex-wrap gap-2">
                            {matchedSkills.unmatched.map(rs => (
                              <Badge key={rs.id} variant="outline">
                                <XCircle className="h-3 w-3 mr-1" />
                                {rs.skill?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Details Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Type</div>
                        <div className="font-medium">{project.type || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Status</div>
                        <div className="font-medium">{project.status || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                        <div className="font-medium">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">End Date</div>
                        <div className="font-medium">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {project.requiredSkills && project.requiredSkills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map(rs => (
                          <Badge key={rs.id} variant="secondary">
                            {rs.skill?.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(project.githubUrl || project.liveUrl) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:underline"
                        >
                          <Github className="h-4 w-4" />
                          <span>View on GitHub</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span>View Live Project</span>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Project Lead</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.owner && (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={project.owner.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {project.owner.firstName?.[0]}
                            {project.owner.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {project.owner.firstName} {project.owner.lastName}
                            <span className="text-muted-foreground text-sm ml-2">(Owner)</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {project.owner.department || "No department"}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        Team Members ({currentMemberCount}/{maxMembers || "∞"})
                      </CardTitle>
                      {isProjectFull && (
                        <Badge className="bg-red-100 text-red-800">FULL</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.members && project.members.length > 0 ? (
                      <div className="space-y-4">
                        {project.members.map((member: any) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.user?.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {member.user?.firstName?.[0]}
                                  {member.user?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {member.user?.firstName} {member.user?.lastName}
                                  {member.userId === project.ownerId && (
                                    <span className="text-muted-foreground text-sm ml-2">(Owner)</span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Badge className={getRoleColor(member.role)}>
                              {member.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No team members yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Resources</CardTitle>
                    <CardDescription>Resources linked to this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projectResources && projectResources.length > 0 ? (
                      <div className="space-y-4">
                        {projectResources.map((resource: any) => (
                          <div
                            key={resource.id}
                            className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => router.push(`/resources/${resource.id}`)}
                          >
                            <div className="flex-1">
                              <div className="font-medium mb-1">{resource.title}</div>
                              <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {resource.description}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {resource.views || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {resource.downloads || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {resource.likes || 0}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No resources linked yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join/Status Button */}
            {canRequestToJoin && currentUser && (
              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleJoinRequest}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Request to Join
              </Button>
            )}

            {hasPendingRequest && (
              <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" disabled>
                <Clock className="h-4 w-4 mr-2" />
                Request Pending
              </Button>
            )}

            {isProjectFull && !isOwner && !isMember && (
              <Button size="lg" className="w-full bg-gray-400 text-white" disabled>
                Project Full
              </Button>
            )}

            {isProjectClosed && !isOwner && !isMember && (
              <Button size="lg" className="w-full bg-gray-400 text-white" disabled>
                Project Closed
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
                  <div className="text-2xl font-bold">{currentMemberCount}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Members</span>
                      <span>{maxMembers || "Unlimited"}</span>
                    </div>
                    {project.requiredSkills && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Required Skills</span>
                        <span>{project.requiredSkills.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Lead */}
            <Button 
              variant="outline" 
              className="w-full bg-transparent"
              onClick={() => {
                if (currentUser && project?.owner?.id) {
                  router.push(`/messages/${project.owner.id}`)
                } else if (!currentUser) {
                  toast({
                    title: "Authentication Required",
                    description: "Please login to message the project lead",
                    variant: "destructive",
                  })
                  router.push("/login")
                }
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Lead
            </Button>

            {/* Manage Join Requests (Owner Only) */}
            {isOwner && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/projects/my-requests")}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Join Requests
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request to Join Project</DialogTitle>
            <DialogDescription>
              Send a message to the project owner (optional, max 500 characters)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell the project owner why you want to join..."
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <div className="text-xs text-muted-foreground text-right">
                {joinMessage.length}/500
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitJoinRequest} 
              disabled={isSubmittingJoin}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmittingJoin ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="RECRUITING">Recruiting</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-maxMembers">Max Members</Label>
                <Input
                  id="edit-maxMembers"
                  type="number"
                  min={currentMemberCount}
                  value={editFormData.maxMembers}
                  onChange={(e) => setEditFormData({ ...editFormData, maxMembers: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editFormData.startDate}
                  onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editFormData.endDate}
                  onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-github">GitHub URL</Label>
              <Input
                id="edit-github"
                placeholder="https://github.com/..."
                value={editFormData.githubUrl}
                onChange={(e) => setEditFormData({ ...editFormData, githubUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-live">Live URL</Label>
              <Input
                id="edit-live"
                placeholder="https://..."
                value={editFormData.liveUrl}
                onChange={(e) => setEditFormData({ ...editFormData, liveUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant={editFormData.requiredSkills.includes(skill.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSkill(skill.id)}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitProjectEdit} 
              disabled={isSubmittingEdit}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmittingEdit ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
