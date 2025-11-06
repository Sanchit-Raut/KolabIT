"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageCircle, LinkIcon, Github, Loader2, Share2 } from "lucide-react"
import Link from "next/link"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [loading, setLoading] = useState(false)

  // Mock project data
  const project = {
    id: projectId,
    title: "Campus Food Delivery App",
    description:
      "Building a React Native app to help students order food from campus restaurants with real-time tracking and group ordering features.",
    status: "Recruiting",
    type: "Mobile Development",
    difficulty: "Intermediate",
    maxMembers: 6,
    githubUrl: "https://github.com/example/campus-food-delivery",
    liveUrl: "https://example.com",
    owner: {
      id: "user1",
      firstName: "Sarah",
      lastName: "Martinez",
      avatar: "/smiling-female-student.png",
      department: "Computer Science",
    },
    members: [
      { id: "user2", firstName: "David", lastName: "Johnson", avatar: "/male-student-confident.jpg" },
      { id: "user3", firstName: "Emma", lastName: "Rodriguez", avatar: "/female-student-creative.jpg" },
    ],
    requiredSkills: ["React Native", "Node.js", "MongoDB", "UI/UX Design"],
    tasks: [
      { id: "1", title: "Setup project repository", status: "completed", priority: "high" },
      { id: "2", title: "Design database schema", status: "in-progress", priority: "high" },
      { id: "3", title: "Create mobile UI", status: "todo", priority: "medium" },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
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
                        <Badge variant="secondary">{project.difficulty}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
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
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">End Date</p>
                          <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Team Size</p>
                          <p className="font-medium">
                            {project.members.length + 1}/{project.maxMembers} members
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                          <p className="font-medium">{project.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

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
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Leader</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/profile/${project.owner.id}`}>
                        <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={project.owner.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {project.owner.firstName[0]}
                              {project.owner.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">
                              {project.owner.firstName} {project.owner.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{project.owner.department}</p>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members ({project.members.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {project.members.map((member) => (
                        <Link key={member.id} href={`/profile/${member.id}`}>
                          <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <Avatar>
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {member.firstName[0]}
                                {member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.firstName} {member.lastName}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tasks Tab */}
                <TabsContent value="tasks" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Badge className={getStatusColor(task.status)} className="capitalize">
                            {task.status}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
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
              {/* Join Button */}
              {project.status === "Recruiting" && project.members.length < project.maxMembers && (
                <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Apply to Join
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
                      {project.maxMembers - project.members.length - 1}
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Team Members</p>
                    <div className="flex -space-x-2">
                      {[project.owner, ...project.members].map((member, idx) => (
                        <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
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
        )}
      </div>
    </div>
  )
}
