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
      credentials: "include",
    })

    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      console.error(`[API Error] Invalid content type:`, contentType)
      throw new Error("Server error: Invalid response format")
    }

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        console.warn(`[API] Unauthorized - removing token`)
        tokenManager.removeToken()
      }
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

    // DO NOT save token on registration - user must verify email first
    // Token will be saved after they verify and login

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
// Resource API
// ============================================

export const resourceApi = {
  getResources: async (params: {
    page?: number;
    limit?: number;
    subject?: string;
    type?: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
    semester?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.type) queryParams.append('type', params.type);
    if (params.semester) queryParams.append('semester', params.semester.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiCall<Resource>(`/resources?${queryParams}`);
    return response.data;
  },

  getResourceById: async (resourceId: string): Promise<Resource> => {
    const response = await apiCall<Resource>(`/resources/${resourceId}`);
    return response.data!;
  },

  getResourcesByUser: async (userId: string, params: {
    page?: number;
    limit?: number;
    subject?: string;
    type?: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
    semester?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.type) queryParams.append('type', params.type);
    if (params.semester) queryParams.append('semester', params.semester.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiCall<Resource>(`/resources/user/${userId}?${queryParams}`);
    return response.data;
  },

  getPopularResources: async (): Promise<Resource[]> => {
    const response = await apiCall<Resource[]>('/resources/popular');
    return response.data!;
  },

  createResource: async (formData: FormData): Promise<Resource> => {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenManager.getToken()}`,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create resource');
    }

    const data = await response.json();
    return data.data;
  },

  updateResource: async (resourceId: string, updateData: Partial<Resource>): Promise<Resource> => {
    const response = await apiCall<Resource>(`/resources/${resourceId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data!;
  },

  deleteResource: async (resourceId: string): Promise<void> => {
    await apiCall(`/resources/${resourceId}`, {
      method: 'DELETE',
    });
  },

  getResourceStats: async (resourceId: string): Promise<{
    downloads: number;
    averageRating: number;
    totalRatings: number;
  }> => {
    const response = await apiCall<{
      downloads: number;
      averageRating: number;
      totalRatings: number;
    }>(`/resources/${resourceId}/stats`);
    return response.data!;
  },

  getResourceRatings: async (resourceId: string): Promise<ResourceRating[]> => {
    const response = await apiCall<ResourceRating[]>(`/resources/${resourceId}/ratings`);
    return response.data!;
  },

  rateResource: async (resourceId: string, ratingData: { rating: number; review?: string }) => {
    const response = await apiCall(`/resources/${resourceId}/rating`, {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
    return response.data;
  },

  toggleLike: async (resourceId: string): Promise<{ liked: boolean; likes: number }> => {
    const response = await apiCall<{ liked: boolean; likes: number }>(`/resources/${resourceId}/like`, {
      method: 'POST',
    });
    return response.data!;
  },

  trackDownload: async (resourceId: string) => {
    const response = await apiCall(`/resources/${resourceId}/download`, {
      method: 'POST',
    });
    return response.data;
  },
};

// ============================================
// User API
// ============================================

export const userApi = {
  getUsers: async (
    params: {
      search?: string
      skills?: string[]
      department?: string
      page?: number
      limit?: number
    } = {},
  ) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append("search", params.search)
    if (params.skills?.length) queryParams.append("skills", params.skills.join(","))
    if (params.department) queryParams.append("department", params.department)
    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())

    const response = await apiCall(`/users?${queryParams}`)
    return response.data
  },

  searchUsers: async (
    params: {
      search?: string
      skills?: string[]
      department?: string
      year?: number
      page?: number
      limit?: number
    } = {},
  ) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append("search", params.search)
    // Backend validator expects skills as array, so append each skill separately with the same key
    // This makes Express parse it as an array: ?skills=Java&skills=Python
    if (params.skills?.length) {
      params.skills.forEach(skill => queryParams.append("skills", skill))
    }
    if (params.department) queryParams.append("department", params.department)
    if (params.year) queryParams.append("year", params.year.toString())
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

  getUserStats: async (userId: string) => {
    const response = await apiCall(`/users/${userId}/stats`)
    return response.data
  },

  addSkill: async (skillData: { skillId: string; proficiency: string; yearsOfExp?: number }) => {
    const response = await apiCall("/users/skills", {
      method: "POST",
      body: JSON.stringify(skillData),
    })
    return response.data
  },

  deleteSkill: async (skillId: string) => {
    const response = await apiCall(`/users/skills/${skillId}`, {
      method: "DELETE",
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

  createProject: async (projectData: {
    title: string
    description: string
    type: string
    status?: string
    maxMembers?: number
    requiredSkills?: string[]
    startDate?: string
    endDate?: string
    githubUrl?: string
    liveUrl?: string
  }): Promise<Project> => {
    const response = await apiCall<Project>("/projects", {
      method: "POST",
      body: JSON.stringify({
        title: projectData.title,
        description: projectData.description,
        type: projectData.type, // ACADEMIC, PERSONAL, COMPETITION, INTERNSHIP
        status: projectData.status || "RECRUITING",
        maxMembers: projectData.maxMembers,
        requiredSkills: projectData.requiredSkills || [],
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        githubUrl: projectData.githubUrl,
        liveUrl: projectData.liveUrl,
      }),
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

  requestToJoinProject: async (projectId: string, message?: string) => {
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

  getProjectsByUser: async (userId: string) => {
    const response = await apiCall(`/projects/user/${userId}`)
    return response.data
  },

  // Join Request Management
  getJoinRequests: async (projectId: string) => {
    const response = await apiCall(`/projects/${projectId}/join-requests`)
    return response.data
  },

  getMyJoinRequests: async () => {
    const response = await apiCall('/projects/my-join-requests')
    return response.data
  },

  updateJoinRequest: async (projectId: string, requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    const response = await apiCall(`/projects/${projectId}/join-request/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
    return response.data
  },

  // Resource Linking
  linkResource: async (projectId: string, resourceId: string) => {
    const response = await apiCall(`/projects/${projectId}/resources`, {
      method: 'POST',
      body: JSON.stringify({ resourceId }),
    })
    return response.data
  },

  unlinkResource: async (projectId: string, resourceId: string) => {
    const response = await apiCall(`/projects/${projectId}/resources/${resourceId}`, {
      method: 'DELETE',
    })
    return response.data
  },

  getProjectResources: async (projectId: string) => {
    const response = await apiCall(`/projects/${projectId}/resources`)
    return response.data
  },

  // Member Management
  removeMember: async (projectId: string, memberId: string) => {
    const response = await apiCall(`/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
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

  getPostComments: async (postId: string) => {
    const response = await apiCall<any>(`/posts/${postId}/comments`)
    return response.data
  },

  createPost: async (postData: {
    title: string
    content: string
    type: string
    tags?: string[]
  }) => {
    const response = await apiCall("/posts", {
      method: "POST",
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
        type: postData.type, // DISCUSSION, ANNOUNCEMENT, HELP, SHOWCASE
        tags: postData.tags || [],
      }),
    })
    return response.data
  },

  addComment: async (postId: string, content: string) => {
    const response = await apiCall(`/posts/${postId}/comments`, {
      method: 'POST',
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

  deletePost: async (postId: string) => {
    const response = await apiCall(`/posts/${postId}`, {
      method: "DELETE",
    })
    return response.data
  },
}

// ============================================
// Skill API
// ============================================

export const skillApi = {
  getAllSkills: async (page = 1, limit = 100) => {
    const response = await apiCall<any>(`/skills?page=${page}&limit=${limit}`)
    // Handle both direct array and nested data structure
    return {
      data: Array.isArray(response.data) ? response.data : response.data?.data || response.data?.items || [],
    }
  },

  getSkillById: async (skillId: string) => {
    const response = await apiCall(`/skills/${skillId}`)
    return response.data
  },

  getUserSkills: async (userId: string) => {
    const response = await apiCall(`/users/${userId}/skills`)
    return {
      data: Array.isArray(response.data) ? response.data : response.data?.data || response.data?.items || [],
    }
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

// ============================================
// Message API
// ============================================

export const messageApi = {
  getUserMessages: async () => {
    const response = await apiCall("/messages")
    return response.data
  },

  getMessagesWith: async (recipientId: string) => {
    const response = await apiCall(`/messages/${recipientId}`)
    return response.data
  },

  sendMessage: async (recipientId: string, content: string) => {
    const response = await apiCall(`/messages/${recipientId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
    return response.data
  },

  deleteMessage: async (messageId: string) => {
    const response = await apiCall(`/messages/${messageId}`, {
      method: "DELETE",
    })
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
  message: messageApi,
}
