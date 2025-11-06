"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Clock, Users, ExternalLink, MessageCircle, Loader2 } from "lucide-react"
import Link from "next/link"

// Temporary mock data for development
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "Campus Food Delivery App",
    description:
      "Building a React Native app to help students order food from campus restaurants with real-time tracking.",
    status: "Recruiting",
    type: "Mobile",
    maxMembers: 6,
    ownerId: "user1",
    owner: { id: "user1", firstName: "Sarah", lastName: "Martinez", avatar: "/smiling-female-student.png" },
    members: [{ id: "user2", firstName: "David", lastName: "Johnson" }],
    requiredSkills: [{ skillId: "react-native", required: true }],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "AI Study Buddy Platform",
    description: "Creating an AI-powered platform for study groups with personalized learning recommendations.",
    status: "In Progress",
    type: "AI/ML",
    maxMembers: 7,
    ownerId: "user3",
    owner: { id: "user3", firstName: "Michael", lastName: "Chen", avatar: "/asian-male-student-developer.jpg" },
    members: [{ id: "user4", firstName: "Lisa", lastName: "Wang" }],
    requiredSkills: [{ skillId: "python", required: true }],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [projects, setProjects] = useState(MOCK_PROJECTS)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const types = [
    "Web Development",
    "Mobile Development",
    "AI/Machine Learning",
    "Data Science",
    "VR/AR",
    "Game Development",
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter
    const matchesType = typeFilter === "all" || project.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recruiting":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const ProjectCard = ({ project }: { project: (typeof MOCK_PROJECTS)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              <Badge variant="outline">{project.type}</Badge>
            </div>
          </div>
        </div>
        <CardDescription className="text-pretty mt-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Leader */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={project.owner?.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {project.owner?.firstName[0]}
              {project.owner?.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">
              {project.owner?.firstName} {project.owner?.lastName}
            </div>
            <div className="text-xs text-muted-foreground">Project Lead</div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">
                {project.members?.length || 0}/{project.maxMembers}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Team Members</div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Open</span>
            </div>
            <div className="text-xs text-muted-foreground">Status</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/projects/${project.id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          {project.status === "Recruiting" && (
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Collaboration Hub</h1>
            <p className="text-muted-foreground">Discover exciting projects to join or create your own</p>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href="/projects/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="recruiting">Recruiting</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">{filteredProjects.length} projects found</div>
        </div>

        {/* Projects Grid */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or create a new project</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recruiting" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects
                .filter((p) => p.status === "Recruiting")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
