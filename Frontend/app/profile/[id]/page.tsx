import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  ExternalLink,
  BookOpen,
  Users,
  MessageCircle,
  Edit,
} from "lucide-react"
import Link from "next/link"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // Mock user data - in real app this would come from API
  const user = {
    id: params.id,
    name: "Sarah Martinez",
    username: "sarah_codes",
    avatar: "/smiling-female-student.png",
    bio: "Computer Science student passionate about full-stack development and AI. Love collaborating on innovative projects and helping fellow students learn to code.",
    university: "Massachusetts Institute of Technology",
    major: "Computer Science",
    year: "Junior",
    location: "Cambridge, MA",
    joinDate: "September 2023",
    email: "sarah.martinez@mit.edu",
    github: "sarahcodes",
    linkedin: "sarah-martinez-dev",
    rating: 4.9,
    reviewCount: 47,
    projectsCompleted: 23,
    skillsShared: 8,
    collaborations: 156,
  }

  const skills = [
    { name: "JavaScript", level: 95, category: "Programming" },
    { name: "React", level: 90, category: "Frontend" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 88, category: "Programming" },
    { name: "UI/UX Design", level: 75, category: "Design" },
    { name: "Machine Learning", level: 70, category: "AI/ML" },
    { name: "PostgreSQL", level: 80, category: "Database" },
    { name: "Git", level: 92, category: "Tools" },
  ]

  const projects = [
    {
      id: 1,
      title: "Campus Food Tracker",
      description: "React Native app helping students find and rate campus dining options with real-time availability.",
      image: "/campus-food-app.jpg",
      technologies: ["React Native", "Node.js", "MongoDB"],
      status: "Completed",
      collaborators: 3,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Study Group Matcher",
      description: "AI-powered platform that matches students for study groups based on courses and learning styles.",
      image: "/study-group-app.jpg",
      technologies: ["Python", "TensorFlow", "Flask"],
      status: "In Progress",
      collaborators: 2,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Campus Event Hub",
      description: "Web application for discovering and organizing campus events with integrated calendar sync.",
      image: "/campus-events.jpg",
      technologies: ["Vue.js", "Express", "PostgreSQL"],
      status: "Completed",
      collaborators: 4,
      rating: 4.7,
    },
  ]

  const achievements = [
    { name: "Code Mentor", description: "Helped 50+ students learn programming", icon: "👨‍🏫" },
    { name: "Project Leader", description: "Successfully led 10+ collaborative projects", icon: "🎯" },
    { name: "Innovation Award", description: "Won MIT Innovation Challenge 2024", icon: "🏆" },
    { name: "Community Builder", description: "Active contributor to campus tech community", icon: "🤝" },
  ]

  const reviews = [
    {
      id: 1,
      reviewer: "David Johnson",
      avatar: "/male-student-confident.jpg",
      rating: 5,
      comment:
        "Sarah was an incredible teammate on our web development project. Her React skills are top-notch and she's great at explaining complex concepts.",
      project: "Campus Food Tracker",
      date: "2 weeks ago",
    },
    {
      id: 2,
      reviewer: "Anna Lee",
      avatar: "/female-student-creative.jpg",
      rating: 5,
      comment:
        "Working with Sarah on the UI design was amazing. She has a great eye for user experience and helped bring our vision to life.",
      project: "Study Group Matcher",
      date: "1 month ago",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold">KolabIT</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Explore Skills
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button className="gradient-primary text-white border-0">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col items-center lg:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(user.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({user.reviewCount} reviews)</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                      <p className="text-lg text-muted-foreground mb-2">@{user.username}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {user.major} • {user.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {user.university}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {user.joinDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 text-pretty">{user.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.projectsCompleted}</div>
                      <div className="text-sm text-muted-foreground">Projects Completed</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.skillsShared}</div>
                      <div className="text-sm text-muted-foreground">Skills Shared</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.collaborations}</div>
                      <div className="text-sm text-muted-foreground">Collaborations</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.rating}</div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Proficiency</CardTitle>
                <CardDescription>Skills that {user.name} can teach and collaborate on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"}>{project.status}</Badge>
                    </div>
                    <CardDescription className="text-pretty">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.collaborators} collaborators
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          {project.rating}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                        {achievement.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.reviewer} />
                          <AvatarFallback>
                            {review.reviewer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{review.reviewer}</CardTitle>
                          <CardDescription>
                            Project: {review.project} • {review.date}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-pretty">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
