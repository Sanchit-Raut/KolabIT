"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Camera, Plus, X, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProfilePage() {
  const [skills, setSkills] = useState([
    { name: "JavaScript", level: 95, category: "Programming" },
    { name: "React", level: 90, category: "Frontend" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 88, category: "Programming" },
  ])

  const [newSkill, setNewSkill] = useState({ name: "", level: 50, category: "Programming" })

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill }])
      setNewSkill({ name: "", level: 50, category: "Programming" })
    }
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const updateSkillLevel = (index: number, level: number) => {
    const updatedSkills = [...skills]
    updatedSkills[index].level = level
    setSkills(updatedSkills)
  }

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

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/profile/sarah_codes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <Button className="gradient-primary text-white border-0">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information and skills</p>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/smiling-female-student.png" alt="Profile" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Sarah Martinez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="sarah_codes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="sarah.martinez@mit.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input id="university" defaultValue="Massachusetts Institute of Technology" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input id="major" defaultValue="Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Select defaultValue="junior">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freshman">Freshman</SelectItem>
                      <SelectItem value="sophomore">Sophomore</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Cambridge, MA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Username</Label>
                  <Input id="github" defaultValue="sarahcodes" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  defaultValue="Computer Science student passionate about full-stack development and AI. Love collaborating on innovative projects and helping fellow students learn to code."
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Management */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Manage your skills and proficiency levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold">Current Skills</h3>
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Proficiency Level</span>
                          <span>{skill.level}%</span>
                        </div>
                        <Slider
                          value={[skill.level]}
                          onValueChange={(value) => updateSkillLevel(index, value[0])}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Skill */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Add New Skill</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-name">Skill Name</Label>
                    <Input
                      id="skill-name"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="e.g., TypeScript"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skill-category">Category</Label>
                    <Select
                      value={newSkill.category}
                      onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Proficiency Level: {newSkill.level}%</Label>
                    <Slider
                      value={[newSkill.level]}
                      onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
                <Button onClick={addSkill} className="mt-4 bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Availability Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Availability & Preferences</CardTitle>
              <CardDescription>Set your collaboration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="availability">Current Availability</Label>
                  <Select defaultValue="available">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available for projects</SelectItem>
                      <SelectItem value="limited">Limited availability</SelectItem>
                      <SelectItem value="busy">Currently busy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-types">Preferred Project Types</Label>
                  <Select defaultValue="web-development">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-apps">Mobile Apps</SelectItem>
                      <SelectItem value="ai-ml">AI/Machine Learning</SelectItem>
                      <SelectItem value="research">Research Projects</SelectItem>
                      <SelectItem value="design">Design Projects</SelectItem>
                      <SelectItem value="all">Open to all types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="gradient-primary text-white border-0" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
