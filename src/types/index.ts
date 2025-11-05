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
  firstName: string;
  lastName: string;
  rollNumber?: string;
  department?: string;
  year?: number;
  semester?: number;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rollNumber?: string;
  department?: string;
  year?: number;
  semester?: number;
  bio?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  rollNumber?: string;
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
  createdAt: Date;
}

export interface UserSkillData {
  id: string;
  userId: string;
  skillId: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExp?: number;
  endorsements: number;
  skill: SkillData;
}

export interface CreateUserSkillData {
  skillId: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExp?: number;
}

// Project types
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  type: 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP';
  maxMembers?: number;
  startDate?: Date;
  endDate?: Date;
  githubUrl?: string;
  liveUrl?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: UserProfile;
  members: ProjectMemberData[];
  requiredSkills: ProjectSkillData[];
  tasks: TaskData[];
}

export interface CreateProjectData {
  title: string;
  description: string;
  type: 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP';
  maxMembers?: number;
  startDate?: Date;
  endDate?: Date;
  githubUrl?: string;
  liveUrl?: string;
  requiredSkills: string[];
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  type?: 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP';
  maxMembers?: number;
  startDate?: Date;
  endDate?: Date;
  githubUrl?: string;
  liveUrl?: string;
}

export interface ProjectMemberData {
  id: string;
  projectId: string;
  userId: string;
  role: 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER';
  joinedAt: Date;
  user: UserProfile;
}

export interface ProjectSkillData {
  id: string;
  projectId: string;
  skillId: string;
  required: boolean;
  skill: SkillData;
}

export interface JoinRequestData {
  id: string;
  projectId: string;
  userId: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  user: UserProfile;
  project: ProjectData;
}

export interface CreateJoinRequestData {
  message?: string;
}

// Task types
export interface TaskData {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignee?: UserProfile;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId?: string;
  dueDate?: Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId?: string;
  dueDate?: Date;
}

// Resource types
export interface ResourceData {
  id: string;
  title: string;
  description?: string;
  type: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
  subject: string;
  semester?: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  downloads: number;
  uploaderId: string;
  createdAt: Date;
  uploader: UserProfile;
  ratings: ResourceRatingData[];
}

export interface CreateResourceData {
  title: string;
  description?: string;
  type: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
  subject: string;
  semester?: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface UpdateResourceData {
  title?: string;
  description?: string;
  type?: 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE';
  subject?: string;
  semester?: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ResourceRatingData {
  id: string;
  resourceId: string;
  userId: string;
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
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
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
  postId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
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
  postId: string;
  userId: string;
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
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: BadgeData;
}

// Notification types
export interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

export interface CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

// Message types
export interface MessageData {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: Date;
  sender: UserProfile;
  receiver: UserProfile;
}

export interface CreateMessageData {
  content: string;
  receiverId: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
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
  userId: string;
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
  newPassword: string;
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

// Certification types
export interface CreateCertificationData {
  name: string;
  issuer: string;
  date: Date | string;
  imageUrl?: string;
}

export interface UpdateCertificationData {
  name?: string;
  issuer?: string;
  date?: Date | string;
  imageUrl?: string;
}

// Portfolio types
export interface CreatePortfolioData {
  title: string;
  link: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

export interface UpdatePortfolioData {
  title?: string;
  link?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

// Analytics types
export interface AnalyticsData {
  profileViews: number;
  projectInvites: number;
  ratingsAvg: number;
  ratingsCount: number;
  lastViewedAt?: Date;
}
