// types.ts - Complete TypeScript types for KolabIT Frontend

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    message: string
    code: string
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  rollNumber?: string
  department?: string
  year?: number
  semester?: number
  bio?: string
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserWithSkills extends User {
  skills?: UserSkill[]
  badges?: UserBadge[]
}

export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  rollNumber?: string
  department?: string
  year?: number
  semester?: number
  bio?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  bio?: string
  department?: string
  year?: number
  semester?: number
  avatar?: string
}

export interface UserSearchParams {
  page?: number
  limit?: number
  search?: string
  skills?: string[]
  department?: string
  year?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface UserStats {
  projectCount: number
  skillCount: number
  badgeCount: number
  endorsementCount: number
  resourceCount: number
  postCount: number
}

// ============================================
// Auth Types
// ============================================

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends CreateUserData {}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

// ============================================
// Skill Types
// ============================================

export interface Skill {
  id: string
  name: string
  category: string
  description?: string
  icon?: string
  createdAt: string
}

export interface UserSkill {
  id: string
  userId: string
  skillId: string
  proficiency: string
  yearsOfExp?: number
  endorsements: number
  skill?: Skill
}

export interface CreateUserSkillData {
  skillId: string
  proficiency: string
  yearsOfExp?: number
}

// ============================================
// Project Types
// ============================================

export interface Project {
  id: string
  title: string
  description: string
  status: string
  type: string
  maxMembers?: number
  startDate?: string
  endDate?: string
  githubUrl?: string
  liveUrl?: string
  ownerId: string
  owner?: User
  members?: ProjectMember[]
  requiredSkills?: ProjectSkill[]
  tasks?: Task[]
  createdAt: string
  updatedAt: string
  difficulty?: string
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: string
  joinedAt: string
  user?: User
}

export interface ProjectSkill {
  id: string
  projectId: string
  skillId: string
  required: boolean
  skill?: Skill
}

export interface CreateProjectData {
  title: string
  description: string
  status: string
  type: string
  maxMembers?: number
  startDate?: string
  endDate?: string
  githubUrl?: string
  liveUrl?: string
  requiredSkills?: {
    skillId: string
    required: boolean
  }[]
}

export interface UpdateProjectData {
  title?: string
  description?: string
  status?: string
  type?: string
  maxMembers?: number
  startDate?: string
  endDate?: string
  githubUrl?: string
  liveUrl?: string
  requiredSkills?: {
    skillId: string
    required: boolean
  }[]
}

export interface ProjectSearchParams {
  page?: number
  limit?: number
  search?: string
  skills?: string[]
  status?: string
  type?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface JoinRequest {
  id: string
  projectId: string
  userId: string
  message?: string
  status: string
  createdAt: string
  updatedAt: string
  user?: User
  project?: Project
}

// ============================================
// Task Types
// ============================================

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: string
  priority: string
  assigneeId?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  assignee?: User
  project?: Project
}

export interface CreateTaskData {
  title: string
  description?: string
  status: string
  priority: string
  assigneeId?: string
  dueDate?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: string
  priority?: string
  assigneeId?: string
  dueDate?: string
}

// ============================================
// Resource Types
// ============================================

export interface Resource {
  id: string
  title: string
  description?: string
  type: string
  subject: string
  semester?: number
  fileUrl?: string
  fileName?: string
  fileSize?: number
  downloads: number
  uploaderId: string
  uploader?: User
  ratings?: ResourceRating[]
  youtubeUrl?: string
  articleLinks?: Array<{ title: string; url: string }>
  views?: number
  likes?: number
  createdAt: string
  updatedAt?: string
}

export interface ResourceRating {
  id: string
  resourceId: string
  userId: string
  rating: number
  review?: string
  user?: User
}

export interface CreateResourceData {
  title: string
  description?: string
  type: string
  subject: string
  semester?: number
  fileUrl?: string
  fileName?: string
  fileSize?: number
}

export interface UpdateResourceData {
  title?: string
  description?: string
  type?: string
  subject?: string
  semester?: number
}

export interface ResourceSearchParams {
  page?: number
  limit?: number
  search?: string
  subject?: string
  type?: string
  semester?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface CreateResourceRatingData {
  rating: number
  review?: string
}

// ============================================
// Post Types
// ============================================

export interface Post {
  id: string
  title: string
  content: string
  type: string
  tags: string[]
  authorId: string
  author?: User
  comments?: Comment[]
  likes?: Like[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  author?: User
  createdAt: string
  updatedAt: string
}

export interface Like {
  id: string
  postId: string
  userId: string
  user?: User
}

export interface CreatePostData {
  title: string
  content: string
  type: string
  tags: string[]
}

export interface UpdatePostData {
  title?: string
  content?: string
  type?: string
  tags?: string[]
}

export interface PostSearchParams {
  page?: number
  limit?: number
  search?: string
  type?: string
  tags?: string[]
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface CreateCommentData {
  content: string
}

// ============================================
// Badge Types
// ============================================

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  criteria: string
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: string
  badge?: Badge
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  data?: any
  createdAt: string
}

// ============================================
// Certification Types
// ============================================

export interface Certification {
  id: string
  userId: string
  name: string
  issuer: string
  date: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCertificationData {
  name: string
  issuer: string
  date: string
  imageUrl?: string
}

// ============================================
// Analytics Types
// ============================================

export interface Analytics {
  id: string
  userId: string
  profileViews: number
  projectInvites: number
  ratingsAvg: number
  ratingsCount: number
  lastViewedAt?: string
  updatedAt: string
}

export interface AnalyticsReport {
  overview: {
    profileViews: number
    projectInvites: number
    skillEndorsements: number
  }
  activity: {
    projectsCreated: number
    projectsJoined: number
    resourcesUploaded: number
    postsCreated: number
  }
  engagement: {
    commentsReceived: number
    likesReceived: number
    endorsementsGiven: number
  }
}

export interface EngagementScore {
  score: number
  level: string
  breakdown: {
    projects: number
    resources: number
    community: number
    skills: number
  }
}
