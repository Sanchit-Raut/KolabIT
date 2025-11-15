// api-examples.ts - Example API calls for KolabIT

import { 
  ApiResponse, 
  AuthResponse, 
  User, 
  Project, 
  Resource,
  Post,
  LoginCredentials,
  CreateUserData 
} from './types';

// ============================================
// API Configuration
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ============================================
// Helper Functions
// ============================================

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Set auth token in localStorage
 */
const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Remove auth token from localStorage
 */
const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Make authenticated API call
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }

  return data;
}

// ============================================
// Authentication API Calls
// ============================================

export const authApi = {
  /**
   * Register new user
   */
  register: async (userData: CreateUserData): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data!;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data!;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiCall<User>('/auth/profile');
    return response.data!;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiCall<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data!;
  },

  /**
   * Logout user
   */
  logout: () => {
    removeAuthToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// ============================================
// User API Calls
// ============================================

export const userApi = {
  /**
   * Search users
   */
  searchUsers: async (params: {
    search?: string;
    skills?: string[];
    department?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.skills?.length) queryParams.append('skills', params.skills.join(','));
    if (params.department) queryParams.append('department', params.department);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiCall(`/users/search?${queryParams}`);
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<User> => {
    const response = await apiCall<User>(`/users/${userId}`);
    return response.data!;
  },

  /**
   * Get user skills
   */
  getUserSkills: async (userId: string) => {
    const response = await apiCall(`/users/${userId}/skills`);
    return response.data;
  },

  /**
   * Add skill to profile
   */
  addSkill: async (skillData: { skillId: string; proficiency: string; yearsOfExp?: number }) => {
    const response = await apiCall('/users/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
    return response.data;
  },

  /**
   * Endorse user skill
   */
  endorseSkill: async (userId: string, skillId: string) => {
    const response = await apiCall(`/users/${userId}/skills/${skillId}/endorse`, {
      method: 'POST',
    });
    return response.data;
  },
};

// ============================================
// Project API Calls
// ============================================

export const projectApi = {
  /**
   * Get all projects
   */
  getProjects: async (params: {
    search?: string;
    skills?: string[];
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.skills?.length) queryParams.append('skills', params.skills.join(','));
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiCall(`/projects?${queryParams}`);
    return response.data;
  },

  /**
   * Get project by ID
   */
  getProjectById: async (projectId: string): Promise<Project> => {
    const response = await apiCall<Project>(`/projects/${projectId}`);
    return response.data!;
  },

  /**
   * Create new project
   */
  createProject: async (projectData: any): Promise<Project> => {
    const response = await apiCall<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response.data!;
  },

  /**
   * Update project
   */
  updateProject: async (projectId: string, projectData: any): Promise<Project> => {
    const response = await apiCall<Project>(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
    return response.data!;
  },

  /**
   * Delete project
   */
  deleteProject: async (projectId: string) => {
    const response = await apiCall(`/projects/${projectId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  /**
   * Request to join project
   */
  requestToJoin: async (projectId: string, message?: string) => {
    const response = await apiCall(`/projects/${projectId}/join-request`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return response.data;
  },

  /**
   * Get project members
   */
  getMembers: async (projectId: string) => {
    const response = await apiCall(`/projects/${projectId}/members`);
    return response.data;
  },
};

// ============================================
// Resource API Calls
// ============================================

export const resourceApi = {
  /**
   * Get all resources
   */
  getResources: async (params: {
    search?: string;
    subject?: string;
    type?: string;
    semester?: number;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.type) queryParams.append('type', params.type);
    if (params.semester) queryParams.append('semester', params.semester.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiCall(`/resources?${queryParams}`);
    return response.data;
  },

  /**
   * Get resource by ID
   */
  getResourceById: async (resourceId: string): Promise<Resource> => {
    const response = await apiCall<Resource>(`/resources/${resourceId}`);
    return response.data!;
  },

  /**
   * Upload resource (with file)
   */
  uploadResource: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  /**
   * Track resource download
   */
  trackDownload: async (resourceId: string) => {
    const response = await apiCall(`/resources/${resourceId}/download`, {
      method: 'POST',
    });
    return response.data;
  },

  /**
   * Rate resource
   */
  rateResource: async (resourceId: string, rating: number, review?: string) => {
    const response = await apiCall(`/resources/${resourceId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    });
    return response.data;
  },
};

// ============================================
// Post API Calls
// ============================================

export const postApi = {
  /**
   * Get all posts
   */
  getPosts: async (params: {
    search?: string;
    type?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.type) queryParams.append('type', params.type);
    if (params.tags?.length) queryParams.append('tags', params.tags.join(','));
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiCall(`/posts?${queryParams}`);
    return response.data;
  },

  /**
   * Get post by ID
   */
  getPostById: async (postId: string): Promise<Post> => {
    const response = await apiCall<Post>(`/posts/${postId}`);
    return response.data!;
  },

  /**
   * Create new post
   */
  createPost: async (postData: { title: string; content: string; type: string; tags: string[] }) => {
    const response = await apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    return response.data;
  },

  /**
   * Add comment to post
   */
  addComment: async (postId: string, content: string) => {
    const response = await apiCall(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response.data;
  },

  /**
   * Like/unlike post
   */
  likePost: async (postId: string) => {
    const response = await apiCall(`/posts/${postId}/like`, {
      method: 'POST',
    });
    return response.data;
  },
};

// ============================================
// Skill API Calls
// ============================================

export const skillApi = {
  /**
   * Get all skills
   */
  getAllSkills: async () => {
    const response = await apiCall('/skills');
    return response.data;
  },

  /**
   * Get skills by category
   */
  getSkillsByCategory: async (category: string) => {
    const response = await apiCall(`/skills/category/${category}`);
    return response.data;
  },

  /**
   * Search skills
   */
  searchSkills: async (term: string, category?: string) => {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);

    const response = await apiCall(`/skills/search/${term}?${queryParams}`);
    return response.data;
  },

  /**
   * Get skill categories
   */
  getCategories: async () => {
    const response = await apiCall('/skills/categories/list');
    return response.data;
  },
};

// ============================================
// Badge API Calls
// ============================================

export const badgeApi = {
  /**
   * Get all badges
   */
  getAllBadges: async () => {
    const response = await apiCall('/badges');
    return response.data;
  },

  /**
   * Get user badges
   */
  getUserBadges: async (userId: string) => {
    const response = await apiCall(`/badges/${userId}`);
    return response.data;
  },

  /**
   * Check and award badges
   */
  checkBadges: async () => {
    const response = await apiCall('/badges/check', {
      method: 'POST',
    });
    return response.data;
  },
};

// ============================================
// Notification API Calls
// ============================================

export const notificationApi = {
  /**
   * Get notifications
   */
  getNotifications: async (page = 1, limit = 20) => {
    const response = await apiCall(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string) => {
    const response = await apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    return response.data;
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async () => {
    const response = await apiCall('/notifications/read-all', {
      method: 'PUT',
    });
    return response.data;
  },
};

// ============================================
// Analytics API Calls
// ============================================

export const analyticsApi = {
  /**
   * Get my analytics
   */
  getMyAnalytics: async () => {
    const response = await apiCall('/analytics/my');
    return response.data;
  },

  /**
   * Get analytics report
   */
  getReport: async () => {
    const response = await apiCall('/analytics/my/report');
    return response.data;
  },

  /**
   * Get engagement score
   */
  getEngagementScore: async () => {
    const response = await apiCall('/analytics/my/engagement');
    return response.data;
  },
};

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
};