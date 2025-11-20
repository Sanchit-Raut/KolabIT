"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, Plus, X, Save, ArrowLeft, Loader2, AlertCircle, Check, ChevronsUpDown, Trash2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { authApi, userApi, skillApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { User, UserSkill } from "@/lib/types"

interface LocalUserSkill {
  id?: string
  skillId: string
  skillName: string
  proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
  yearsOfExp?: number
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user: currentUser, updateUser, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<User>>({})
  const [userSkills, setUserSkills] = useState<LocalUserSkill[]>([])
  const [originalSkills, setOriginalSkills] = useState<LocalUserSkill[]>([])
  const [availableSkills, setAvailableSkills] = useState<Array<{ id: string; name: string }>>([])
  const [newSkill, setNewSkill] = useState<{
    skillId: string
    proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
    yearsOfExp: number
  }>({ skillId: "", proficiency: "BEGINNER", yearsOfExp: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [openSkillCombobox, setOpenSkillCombobox] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchUserData()
    }
  }, [currentUser, authLoading])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      // Fetch user profile
      const userData = await authApi.getProfile()
      setFormData(userData)

      // Fetch available skills
      const skillsData = await skillApi.getAllSkills()
      const skillList = skillsData?.data || []
      // Sort skills alphabetically by name
      const sortedSkills = skillList
        .map((s: any) => ({
          id: s.id,
          name: s.name,
        }))
        .sort((a: { id: string; name: string }, b: { id: string; name: string }) => a.name.localeCompare(b.name))
      setAvailableSkills(sortedSkills)

      // Fetch user's current skills
      if (currentUser?.id) {
        const userSkillsData = await userApi.getUserSkills(currentUser.id)
        if (Array.isArray(userSkillsData)) {
          const processedSkills = userSkillsData.map((skill: UserSkill) => ({
            id: skill.id,
            skillId: skill.skillId,
            skillName: skill.skill?.name || "Unknown Skill",
            proficiency: skill.proficiency as any,
            yearsOfExp: skill.yearsOfExp,
          }))
          setUserSkills(processedSkills)
          setOriginalSkills(processedSkills) // Store original skills for comparison
        }
      }
    } catch (err) {
      console.error("[v0] Error fetching user data:", err)
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG or PNG files only.",
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please upload a file smaller than 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    // Create image preview and validate dimensions
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      if (img.width > 2000 || img.height > 2000) {
        toast({
          title: "Image too large",
          description: "Image dimensions should be less than 2000x2000 pixels",
          variant: "destructive",
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string })
        toast({
          title: "Photo uploaded",
          description: "Click 'Save Changes' to update your profile picture",
        })
      }
      reader.readAsDataURL(file)
    }
    img.onerror = () => {
      toast({
        title: "Invalid image",
        description: "Please upload a valid image file",
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const addSkill = () => {
    if (!newSkill.skillId) {
      toast({
        title: "Error",
        description: "Please select a skill",
        variant: "destructive",
      })
      return
    }

    if (userSkills.some((s) => s.skillId === newSkill.skillId)) {
      toast({
        title: "Error",
        description: "You already have this skill",
        variant: "destructive",
      })
      return
    }

    const skillName = availableSkills.find((s) => s.id === newSkill.skillId)?.name || newSkill.skillId
    setUserSkills([
      ...userSkills,
      {
        skillId: newSkill.skillId,
        skillName,
        proficiency: newSkill.proficiency,
        yearsOfExp: newSkill.yearsOfExp,
      },
    ])
    setNewSkill({ skillId: "", proficiency: "BEGINNER", yearsOfExp: 0 })
    toast({
      title: "Success",
      description: "Skill added",
    })
  }

  const removeSkill = (skillId: string) => {
    setUserSkills(userSkills.filter((s) => s.skillId !== skillId))
  }

  const handleSave = async () => {
    try {
      setError("")
      setSuccess("")
      setIsSaving(true)

      // Update profile
      const updateData: Partial<User> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        rollNumber: formData.rollNumber,
        bio: formData.bio,
        department: formData.department,
        year: formData.year,
        semester: formData.semester,
        avatar: formData.avatar,
      }

      const updatedUser = await authApi.updateProfile(updateData)
      updateUser(updatedUser)

      // Find skills that were removed (exist in original but not in current)
      const currentSkillIds = userSkills.map(s => s.skillId)
      const removedSkills = originalSkills.filter(s => !currentSkillIds.includes(s.skillId))
      
      // Delete removed skills
      for (const skill of removedSkills) {
        if (skill.skillId) {
          try {
            await userApi.deleteSkill(skill.skillId) // Pass skillId, not the userSkill record id
          } catch (deleteErr) {
            console.error("[v0] Error deleting skill:", deleteErr)
          }
        }
      }

      // Save/update remaining skills
      for (const skill of userSkills) {
        try {
          await userApi.addSkill({
            skillId: skill.skillId,
            proficiency: skill.proficiency,
            yearsOfExp: skill.yearsOfExp || 0,
          })
        } catch (skillErr) {
          console.error("[v0] Error saving skill:", skillErr)
        }
      }

      setSuccess("Profile updated successfully!")
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setTimeout(() => router.push(`/profile/${currentUser?.id}`), 1500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save profile"
      setError(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast({
        title: "Error",
        description: 'Please type "DELETE" to confirm',
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeleting(true)
      await authApi.deleteAccount()
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      })

      // Clear local storage and redirect to landing page
      localStorage.removeItem("token")
      localStorage.clear() // Clear all local storage
      
      // Redirect to landing page and force reload
      window.location.href = "/" // Use window.location.href for hard redirect
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete account"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold">KolabIT</span>
          </Link>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href={`/profile/${currentUser?.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information and skills</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-green-600">{success}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback>
                    {formData.firstName?.[0]}
                    {formData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground mt-2">JPG or PNG. Max size 5MB.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ""}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    placeholder="Enter your first name"
                    maxLength={50}
                  />
                  <p className="text-sm text-muted-foreground">Required field, maximum 50 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ""}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    placeholder="Enter your last name"
                    maxLength={50}
                  />
                  <p className="text-sm text-muted-foreground">Required field, maximum 50 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email || ""} disabled className="bg-muted" />
                  <p className="text-sm text-muted-foreground">Contact support to change email address</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number (UID)</Label>
                  <Input
                    id="rollNumber"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.rollNumber || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, rollNumber: value });
                    }}
                    placeholder="e.g., 123456789"
                    maxLength={20}
                  />
                  <p className="text-sm text-muted-foreground">Your college UID (numbers only)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department || ""}
                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                      <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                      <SelectItem value="Electronics & Telecommunication">Electronics & Telecommunication</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Your academic department</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Current Year</Label>
                  <Select
                    value={(formData.year || "").toString()}
                    onValueChange={(val) => {
                      const yearNum = Number.parseInt(val) || undefined
                      // Reset semester when year changes
                      setFormData({ ...formData, year: yearNum, semester: undefined })
                    }}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Your current year of study</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Select
                    value={(formData.semester || "").toString()}
                    onValueChange={(val) => setFormData({ ...formData, semester: Number.parseInt(val) || undefined })}
                    disabled={!formData.year}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder={formData.year ? "Select semester" : "Select year first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        // Show only relevant semesters based on year
                        // Year 1 = Sem 1,2 | Year 2 = Sem 3,4 | Year 3 = Sem 5,6 | Year 4 = Sem 7,8
                        const year = formData.year || 0
                        if (year < 1 || year > 4) return null
                        const startSem = (year - 1) * 2 + 1
                        const endSem = year * 2
                        return Array.from({ length: 2 }, (_, i) => startSem + i).map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))
                      })()}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {formData.year ? "Your current semester" : "Please select year first"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio || ""}
                  onChange={(e) => {
                    const text = e.target.value
                    if (text.length <= 500) {
                      setFormData({ ...formData, bio: text })
                    }
                  }}
                  placeholder="Tell us about yourself, your interests, and what you're working on..."
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  Brief description about yourself. {formData.bio ? `${500 - formData.bio.length} characters remaining` : 'Maximum 500 characters'}
                </p>
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
              <div className="space-y-4">
                <h3 className="font-semibold">Current Skills</h3>
                {userSkills.length > 0 ? (
                  userSkills.map((skill) => (
                    <div key={skill.skillId} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{skill.skillName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {skill.proficiency}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {skill.yearsOfExp} month{skill.yearsOfExp !== 1 ? "s" : ""} of experience
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.skillId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills added yet</p>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Add New Skill</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-select">Skill Name *</Label>
                    <Popover open={openSkillCombobox} onOpenChange={setOpenSkillCombobox}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          aria-expanded={openSkillCombobox}
                          className={cn(
                            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          )}
                        >
                          <span className={cn(!newSkill.skillId && "text-muted-foreground")}>
                            {newSkill.skillId
                              ? availableSkills.find((skill) => skill.id === newSkill.skillId)?.name
                              : "Select a skill..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search skills..." />
                          <CommandList>
                            <CommandEmpty>No skill found.</CommandEmpty>
                            <CommandGroup>
                              {availableSkills.map((skill) => (
                                <CommandItem
                                  key={skill.id}
                                  value={skill.name}
                                  onSelect={() => {
                                    setNewSkill({ ...newSkill, skillId: skill.id })
                                    setOpenSkillCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newSkill.skillId === skill.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {skill.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proficiency">Proficiency *</Label>
                    <Select
                      value={newSkill.proficiency}
                      onValueChange={(value: any) => setNewSkill({ ...newSkill, proficiency: value })}
                    >
                      <SelectTrigger id="proficiency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="months-of-exp">Months of Experience</Label>
                    <Input
                      id="months-of-exp"
                      type="number"
                      min="0"
                      value={newSkill.yearsOfExp.toString()}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, yearsOfExp: Number.parseInt(e.target.value, 10) || 0 })
                      }
                      placeholder="e.g., 12"
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

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <h4 className="font-semibold text-sm mb-2">What will be deleted:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Your profile information and settings</li>
                  <li>Your skills and badges</li>
                  <li>Your join requests to projects</li>
                  <li>All personal data associated with your account</li>
                </ul>
                <h4 className="font-semibold text-sm mt-4 mb-2">What will be kept:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Your created projects (transferred to anonymous user)</li>
                  <li>Your community posts and comments</li>
                  <li>Your resource ratings and reviews</li>
                  <li>Public contributions to the platform</li>
                </ul>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account Permanently
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your personal data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 font-medium mb-2">
                ⚠️ Warning: This is a permanent action
              </p>
              <p className="text-sm text-red-700">
                Your profile, skills, badges, and join requests will be permanently deleted. Your public contributions (projects, posts, comments, ratings) will remain but will be marked as anonymous.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                Type <span className="font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setDeleteConfirmText("")
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmText !== "DELETE"}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
