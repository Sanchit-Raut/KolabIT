// api.ts - Complete API client for KolabIT with proper authentication and error handling

import type {
  ApiResponse,
  AuthResponse,
  User,
  Project,
  Resource,
  Post,
  LoginCredentials,
  CreateUserData,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// ============================================
// Token Management
// ============================================

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken()
  },
}

// ============================================
// API Call Helper
// ============================================

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = tokenManager.getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || `API error: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("[API Error]", error)
    throw error
  }
}

// ============================================
// Authentication API
// ============================================

export const authApi = {
  register: async (userData: CreateUserData): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (response.data?.token) {
      tokenManager.setToken(response.data.token)
    }

    return response.data!
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.data?.token) {
      tokenManager.setToken(response.data.token)
    }

    return response.data!
  },

  getProfile: async (): Promise<User> => {
    const response = await apiCall<User>("/auth/profile")
    return response.data!
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiCall<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
    return response.data!
  },

  logout: () => {
    tokenManager.removeToken()
  },
}

// ============================================
// User API
// ============================================

export const userApi = {
  searchUsers: async (params: {
    search?: string
    skills?: string[]
    department?: string
    page?: number
    limit?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append("search", params.search)
    if (params.skills?.length) queryParams.append("skills", params.skills.join(","))
    if (params.department) queryParams.append("department", params.department)
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    const response = await apiCall(`/users/search?${queryParams}`)
    return response.data
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiCall<User>(`/users/${userId}`)
    return response.data!
  },

  getUserSkills: async (userId: string) => {
    const response = await apiCall(`/users/${userId}/skills`)
    return response.data
  },

  addSkill: async (skillData: { skillId: string; proficiency: string; yearsOfExp?: number }) => {
    const response = await apiCall("/users/skills", {
      method: "POST",
      body: JSON.stringify(skillData),
    })
    return response.data
  },

  endorseSkill: async (userId: string, skillId: string) => {
    const response = await apiCall(`/users/${userId}/skills/${skillId}/endorse`, {
      method: "POST",
    })
    return response.data
  },
}

// ============================================
// Project API
// ============================================

export const projectApi = {
  getProjects: async (params: {
    search?: string
    skills?: string[]
    status?: string
    type?: string
    page?: number
    limit?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append("search", params.search)
    if (params.skills?.length) queryParams.append("skills", params.skills.join(","))
    if (params.status) queryParams.append("status", params.status)
    if (params.type) queryParams.append("type", params.type)
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    const response = await apiCall(`/projects?${queryParams}`)
    return response.data
  },

  getProjectById: async (projectId: string): Promise<Project> => {
    const response = await apiCall<Project>(`/projects/${projectId}`)
    return response.data!
  },

  createProject: async (projectData: any): Promise<Project> => {
    const response = await apiCall<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    })
    return response.data!
  },

  updateProject: async (projectId: string, projectData: any): Promise<Project> => {
    const response = await apiCall<Project>(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    })
    return response.data!
  },

  deleteProject: async (projectId: string) => {
    const response = await apiCall(`/projects/${projectId}`, {
      method: "DELETE",
    })
    return response.data
  },

  requestToJoin: async (projectId: string, message?: string) => {
    const response = await apiCall(`/projects/${projectId}/join-request`, {
      method: "POST",
      body: JSON.stringify({ message }),
    })
    return response.data
  },

  getMembers: async (projectId: string) => {
    const response = await apiCall(`/projects/${projectId}/members`)
    return response.data
  },
}

// ============================================
// Resource API
// ============================================

export const resourceApi = {
  getResources: async (params: {
    search?: string
    subject?: string
    type?: string
    semester?: number
    page?: number
    limit?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append("search", params.search)
    if (params.subject) queryParams.append("subject", params.subject)
    if (params.type) queryParams.append("type", params.type)
    if (params.semester) queryParams.append("semester", params.semester.toString())
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    const response = await apiCall(`/resources?${queryParams}`)
    return response.data
  },

  getResourceById: async (resourceId: string): Promise<Resource> => {
    const response = await apiCall<Resource>(`/resources/${resourceId}`)
    return response.data!
  },

  uploadResource: async (formData: FormData) => {
    const token = tokenManager.getToken()
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    return response.json()
  },

  trackDownload: async (resourceId: string) => {
    const response = await apiCall(`/resources/${resourceId}/download`, {
      method: "POST",
    })
    return response.data
  },

  rateResource: async (resourceId: string, rating: number, review?: string) => {
    const response = await apiCall(`/resources/${resourceId}/rating`, {
      method: "POST",
      body: JSON.stringify({ rating, review }),
    })
    return response.data
  },
}

// ============================================
// Post API
// ============================================

export const postApi = {
  getPosts: async (params: {
    search?: string
    type?: string
    tags?: string[]
    page?: number
    limit?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append("search", params.search)
    if (params.type) queryParams.append("type", params.type)
    if (params.tags?.length) queryParams.append("tags", params.tags.join(","))
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    const response = await apiCall(`/posts?${queryParams}`)
    return response.data
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await apiCall<Post>(`/posts/${postId}`)
    return response.data!
  },

  createPost: async (postData: { title: string; content: string; type: string; tags: string[] }) => {
    const response = await apiCall("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    })
    return response.data
  },

  addComment: async (postId: string, content: string) => {
    const response = await apiCall(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
    return response.data
  },

  likePost: async (postId: string) => {
    const response = await apiCall(`/posts/${postId}/like`, {
      method: "POST",
    })
    return response.data
  },
}

// ============================================
// Skill API
// ============================================

export const skillApi = {
  getAllSkills: async () => {
    const response = await apiCall("/skills")
    return response.data
  },

  getSkillsByCategory: async (category: string) => {
    const response = await apiCall(`/skills/category/${category}`)
    return response.data
  },

  searchSkills: async (term: string, category?: string) => {
    const queryParams = new URLSearchParams()
    if (category) queryParams.append("category", category)
    const response = await apiCall(`/skills/search/${term}?${queryParams}`)
    return response.data
  },

  getCategories: async () => {
    const response = await apiCall("/skills/categories/list")
    return response.data
  },
}

// ============================================
// Badge API
// ============================================

export const badgeApi = {
  getAllBadges: async () => {
    const response = await apiCall("/badges")
    return response.data
  },

  getUserBadges: async (userId: string) => {
    const response = await apiCall(`/badges/${userId}`)
    return response.data
  },

  checkBadges: async () => {
    const response = await apiCall("/badges/check", {
      method: "POST",
    })
    return response.data
  },
}

// ============================================
// Notification API
// ============================================

export const notificationApi = {
  getNotifications: async (page = 1, limit = 20) => {
    const response = await apiCall(`/notifications?page=${page}&limit=${limit}`)
    return response.data
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiCall(`/notifications/${notificationId}/read`, {
      method: "PUT",
    })
    return response.data
  },

  markAllAsRead: async () => {
    const response = await apiCall("/notifications/read-all", {
      method: "PUT",
    })
    return response.data
  },
}

// ============================================
// Analytics API
// ============================================

export const analyticsApi = {
  getMyAnalytics: async () => {
    const response = await apiCall("/analytics/my")
    return response.data
  },

  getReport: async () => {
    const response = await apiCall("/analytics/my/report")
    return response.data
  },

  getEngagementScore: async () => {
    const response = await apiCall("/analytics/my/engagement")
    return response.data
  },
}

// Export all APIs
export default {
  auth: authApi,
  user: userApi,
  project: projectApi,
  resource: resourceApi,
  post: postApi,
  skill: skillApi,
  badge: badgeApi,
  notification: notificationApi,
  analytics: analyticsApi,
}
