"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Ban, 
  MessageSquare, 
  Star, 
  FolderKanban,
  Trash2,
  Search,
  Loader2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { adminApi, userApi, postApi, resourceApi, projectApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("users")
  
  // Users data
  const [users, setUsers] = useState<any[]>([])
  const [bannedUsers, setBannedUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [bannedSearchTerm, setBannedSearchTerm] = useState("")
  const [postsSearchTerm, setPostsSearchTerm] = useState("")
  const [resourcesSearchTerm, setResourcesSearchTerm] = useState("")
  const [projectsSearchTerm, setProjectsSearchTerm] = useState("")
  
  // Dialogs
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [warnDialogOpen, setWarnDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Selected items
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<"comment" | "rating" | "project" | "resource" | "post" | null>(null)
  
  // Form data
  const [banReason, setBanReason] = useState("")
  const [warnReason, setWarnReason] = useState("")
  const [warnSeverity, setWarnSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM")
  const [deleteReason, setDeleteReason] = useState("")
  const [isPermanentBan, setIsPermanentBan] = useState(true)
  
  // Content data
  const [posts, setPosts] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    // Check if user is admin
    if (!user || (user as any).role !== "ADMIN") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }
    
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load users (you'll need to create this endpoint)
      // For now, we'll just load banned users
      const bannedData: any = await adminApi.getBannedUsers()
      setBannedUsers(bannedData.data || bannedData || [])
      
      // Load content
      const postsData: any = await postApi.getPosts({})
      setPosts(postsData.data || postsData || [])
      
      const resourcesData: any = await resourceApi.getResources({ limit: 50 })
      setResources(resourcesData.data || resourcesData || [])
      
      const projectsData: any = await projectApi.getProjects({})
      setProjects(projectsData.data || projectsData || [])
      
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for banning",
        variant: "destructive",
      })
      return
    }

    try {
      await adminApi.banUser(selectedUser.id, banReason, isPermanentBan)
      toast({
        title: "User Banned",
        description: `${selectedUser.firstName} ${selectedUser.lastName} has been banned`,
      })
      setBanDialogOpen(false)
      setBanReason("")
      setSelectedUser(null)
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      })
    }
  }

  const handleWarnUser = async () => {
    if (!selectedUser || !warnReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a warning reason",
        variant: "destructive",
      })
      return
    }

    try {
      await adminApi.warnUser(selectedUser.id, warnReason, warnSeverity)
      toast({
        title: "Warning Issued",
        description: `Warning sent to ${selectedUser.firstName} ${selectedUser.lastName}`,
      })
      setWarnDialogOpen(false)
      setWarnReason("")
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to issue warning",
        variant: "destructive",
      })
    }
  }

  const handleUnbanUser = async (userId: string) => {
    try {
      await adminApi.unbanUser(userId)
      toast({
        title: "User Unbanned",
        description: "User has been unbanned successfully",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unban user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteContent = async () => {
    if (!selectedItem || !deleteReason.trim() || !deleteType) {
      toast({
        title: "Error",
        description: "Please provide a reason for deletion",
        variant: "destructive",
      })
      return
    }

    try {
      if (deleteType === "comment") {
        await adminApi.deleteComment(selectedItem.id, deleteReason)
      } else if (deleteType === "rating") {
        await adminApi.deleteRating(selectedItem.id, deleteReason)
      } else if (deleteType === "project") {
        await adminApi.deleteProject(selectedItem.id, deleteReason)
      } else if (deleteType === "resource") {
        await adminApi.deleteResource(selectedItem.id, deleteReason)
      } else if (deleteType === "post") {
        await adminApi.deletePost(selectedItem.id, deleteReason)
      }

      toast({
        title: "Content Deleted",
        description: `${deleteType} has been deleted successfully`,
      })
      setDeleteDialogOpen(false)
      setDeleteReason("")
      setSelectedItem(null)
      setDeleteType(null)
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
    }
  }

  // Filter functions for search
  const filteredBannedUsers = bannedUsers.filter(ban => {
    const searchLower = bannedSearchTerm.toLowerCase()
    return (
      ban.user.email?.toLowerCase().includes(searchLower) ||
      ban.user.firstName?.toLowerCase().includes(searchLower) ||
      ban.user.lastName?.toLowerCase().includes(searchLower) ||
      ban.reason?.toLowerCase().includes(searchLower)
    )
  })

  const filteredPosts = posts.filter(post => {
    const searchLower = postsSearchTerm.toLowerCase()
    return (
      post.title?.toLowerCase().includes(searchLower) ||
      post.content?.toLowerCase().includes(searchLower) ||
      post.owner?.email?.toLowerCase().includes(searchLower) ||
      post.owner?.firstName?.toLowerCase().includes(searchLower) ||
      post.owner?.lastName?.toLowerCase().includes(searchLower)
    )
  })

  const filteredResources = resources.filter(resource => {
    const searchLower = resourcesSearchTerm.toLowerCase()
    return (
      resource.title?.toLowerCase().includes(searchLower) ||
      resource.description?.toLowerCase().includes(searchLower) ||
      resource.owner?.email?.toLowerCase().includes(searchLower) ||
      resource.owner?.firstName?.toLowerCase().includes(searchLower) ||
      resource.owner?.lastName?.toLowerCase().includes(searchLower)
    )
  })

  const filteredProjects = projects.filter(project => {
    const searchLower = projectsSearchTerm.toLowerCase()
    return (
      project.title?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      project.owner?.email?.toLowerCase().includes(searchLower) ||
      project.owner?.firstName?.toLowerCase().includes(searchLower) ||
      project.owner?.lastName?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage users, content, and platform moderation</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Banned Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bannedUsers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Banned Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Banned Users</CardTitle>
                <CardDescription>Manage user bans and warnings</CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or reason..."
                      value={bannedSearchTerm}
                      onChange={(e) => setBannedSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredBannedUsers.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    {bannedSearchTerm ? "No banned users found matching your search" : "No banned users"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredBannedUsers.map((ban: any) => (
                      <div key={ban.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{ban.user?.firstName} {ban.user?.lastName}</p>
                          <p className="text-sm text-muted-foreground">{ban.user?.email}</p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Reason:</span> {ban.reason}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Banned on {new Date(ban.bannedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleUnbanUser(ban.userId)}
                        >
                          Unban
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Posts</CardTitle>
                <CardDescription>Monitor and moderate community posts</CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, content, or author..."
                      value={postsSearchTerm}
                      onChange={(e) => setPostsSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPosts.slice(0, 10).map((post: any) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            By {post.author?.firstName} {post.author?.lastName}
                          </p>
                          <p className="text-sm mt-2 line-clamp-2">{post.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/community/${post.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem({ ...post, author: post.author })
                              setDeleteType("post")
                              setDeleteDialogOpen(true)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Manage uploaded resources</CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, description, or author..."
                      value={resourcesSearchTerm}
                      onChange={(e) => setResourcesSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredResources.slice(0, 10).map((resource: any) => (
                    <div key={resource.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {resource.subject} • {resource.type}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{resource.downloads} downloads</span>
                            <span>{resource.views} views</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/resources/${resource.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(resource)
                              setDeleteType("resource")
                              setDeleteDialogOpen(true)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Monitor and manage projects</CardDescription>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, description, or owner..."
                      value={projectsSearchTerm}
                      onChange={(e) => setProjectsSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProjects.slice(0, 10).map((project: any) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            By {project.owner?.firstName} {project.owner?.lastName}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge>{project.status}</Badge>
                            <Badge variant="outline">{project.type}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/projects/${project.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(project)
                              setDeleteType("project")
                              setDeleteDialogOpen(true)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Permanently ban this user from the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for Ban</Label>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for banning this user..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBanUser}>
              <Ban className="h-4 w-4 mr-2" />
              Ban User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warn User Dialog */}
      <Dialog open={warnDialogOpen} onOpenChange={setWarnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warn User</DialogTitle>
            <DialogDescription>
              Issue a warning to this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={warnSeverity} onValueChange={(v: any) => setWarnSeverity(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Warning Message</Label>
              <Textarea
                value={warnReason}
                onChange={(e) => setWarnReason(e.target.value)}
                placeholder="Enter warning message..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setWarnDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWarnUser}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Send Warning
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Content Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteType}</DialogTitle>
            <DialogDescription>
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for Deletion</Label>
              <Textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deleting this content..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContent}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
