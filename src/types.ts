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
  uploader: UserData;
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

export interface ResourceSearchParams {
  page?: number;
  limit?: number;
  subject?: string;
  type?: string;
  semester?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Resource rating types
export interface ResourceRatingData {
  id: string;
  resourceId: string;
  userId: string;
  rating: number;
  review?: string;
  user: UserData;
}

export interface CreateResourceRatingData {
  rating: number;
  review?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// User types
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  department?: string;
  year?: number;
  semester?: number;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}