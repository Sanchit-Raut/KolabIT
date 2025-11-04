import { Request } from 'express';

// Authentication types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Response types
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roll_number?: string;
  department?: string;
  year?: number;
  semester?: number;
  bio?: string;
  avatar?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  roll_number?: string;
  department?: string;
  year?: number;
  semester?: number;
  bio?: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  roll_number?: string;
  department?: string;
  year?: number;
  semester?: number;
  bio?: string;
  avatar?: string;
}

// Skill types
export interface SkillData {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  created_at: Date;
}

export interface UserSkillData {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  years_of_exp?: number;
  endorsements: number;
  skill: SkillData;
}

export interface CreateUserSkillData {
  skill_id: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  years_of_exp?: number;
}

// Project types
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  type: 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP';
  max_members?: number;
  start_date?: Date;
  end_date?: Date;
  github_url?: string;
  live_url?: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
  owner: UserProfile;
  members: ProjectMemberData[];
  required_skills: ProjectSkillData[];
  tasks: TaskData[];
}

export interface CreateProjectData {
  title: string;
  description: string;
  type: 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP';
  max_members?: number;
  start_date?: Date;
  end_date?: Date;
  github_url?: string;
  live_url?: string;
  required_skills: string[];
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  type?: 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP';
  max_members?: number;
  start_date?: Date;
  end_date?: Date;
  github_url?: string;
  live_url?: string;
}

export interface ProjectMemberData {
  id: string;
  project_id: string;
  user_id: string;
  role: 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER';
  joined_at: Date;
  user: UserProfile;
}

export interface ProjectSkillData {
  id: string;
  project_id: string;
  skill_id: string;
  required: boolean;
  skill: SkillData;
}

export interface JoinRequestData {
  id: string;
  project_id: string;
  user_id: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: Date;
  updated_at: Date;
  user: UserProfile;
  project: ProjectData;
}

export interface CreateJoinRequestData {
  message?: string;
}

// Task types
export interface TaskData {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee_id?: string;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
  assignee?: UserProfile;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee_id?: string;
  due_date?: Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee_id?: string;
  due_date?: Date;
}

// Resource types
export interface ResourceData {
  id: string;
  title: string;
  description?: string;
  type: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
  subject: string;
  semester?: number;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  downloads: number;
  uploader_id: string;
  created_at: Date;
  uploader: UserProfile;
  ratings: ResourceRatingData[];
}

export interface CreateResourceData {
  title: string;
  description?: string;
  type: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
  subject: string;
  semester?: number;
  file_url?: string;
  file_name?: string;
  file_size?: number;
}

export interface UpdateResourceData {
  title?: string;
  description?: string;
  type?: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
  subject?: string;
  semester?: number;
  file_url?: string;
  file_name?: string;
  file_size?: number;
}

export interface ResourceRatingData {
  id: string;
  resource_id: string;
  user_id: string;
  rating: number;
  review?: string;
  user: UserProfile;
}

export interface CreateResourceRatingData {
  rating: number;
  review?: string;
}

// Post types
export interface PostData {
  id: string;
  title: string;
  content: string;
  type: 'DISCUSSION' | 'ANNOUNCEMENT' | 'HELP' | 'SHOWCASE';
  tags: string[];
  author_id: string;
  created_at: Date;
  updated_at: Date;
  author: UserProfile;
  comments: CommentData[];
  likes: LikeData[];
}

export interface CreatePostData {
  title: string;
  content: string;
  type: 'DISCUSSION' | 'ANNOUNCEMENT' | 'HELP' | 'SHOWCASE';
  tags: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  type?: 'DISCUSSION' | 'ANNOUNCEMENT' | 'HELP' | 'SHOWCASE';
  tags?: string[];
}

export interface CommentData {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  created_at: Date;
  updated_at: Date;
  author: UserProfile;
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface LikeData {
  id: string;
  post_id: string;
  user_id: string;
  user: UserProfile;
}

// Badge types
export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'SKILL' | 'CONTRIBUTION' | 'ACHIEVEMENT' | 'SPECIAL';
  criteria: string;
}

export interface UserBadgeData {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: Date;
  badge: BadgeData;
}

// Notification types
export interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  data?: any;
  created_at: Date;
}

export interface CreateNotificationData {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

// Message types
export interface MessageData {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  is_read: boolean;
  created_at: Date;
  sender: UserProfile;
  receiver: UserProfile;
}

export interface CreateMessageData {
  content: string;
  receiver_id: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Search and filter types
export interface UserSearchParams extends PaginationParams {
  skills?: string[];
  department?: string;
  year?: number;
  search?: string;
}

export interface ProjectSearchParams extends PaginationParams {
  skills?: string[];
  status?: string;
  type?: string;
  search?: string;
}

export interface ResourceSearchParams extends PaginationParams {
  subject?: string;
  type?: string;
  semester?: number;
  search?: string;
}

export interface PostSearchParams extends PaginationParams {
  type?: string;
  tags?: string[];
  search?: string;
}

// JWT payload
export interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Email verification
export interface EmailVerificationData {
  email: string;
  token: string;
}

// Password reset
export interface PasswordResetData {
  email: string;
  token: string;
  new_password: string;
}

// File upload
export interface FileUploadData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}
