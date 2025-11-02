import prisma from '../config/database';
import {
  ResourceData,
  CreateResourceData,
  UpdateResourceData,
  ResourceSearchParams,
  ResourceRatingData,
  CreateResourceRatingData,
  PaginatedResponse,
} from '../types';

export class ResourceService {
  /**
   * Create new resource
   */
  static async createResource(
    uploaderId: string,
    resourceData: CreateResourceData
  ): Promise<ResourceData> {
    // Check if uploader exists
    const uploader = await prisma.user.findUnique({
      where: { id: uploaderId },
    });

    if (!uploader) {
      throw new Error('Uploader not found');
    }

    const resource = await prisma.resource.create({
      data: {
        ...resourceData,
        uploaderId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                rollNumber: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return {
      id: resource.id,
      title: resource.title,
  description: resource.description ?? undefined,
      type: resource.type as 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE',
      subject: resource.subject,
  semester: resource.semester ?? undefined,
  fileUrl: resource.fileUrl ?? undefined,
  fileName: resource.fileName ?? undefined,
  fileSize: resource.fileSize ?? undefined,
      downloads: resource.downloads,
      uploaderId: resource.uploaderId,
      createdAt: resource.createdAt,
      uploader: resource.uploader as any,
      ratings: resource.ratings.map(rating => ({
        id: rating.id,
        resourceId: rating.resourceId,
        userId: rating.userId,
        rating: rating.rating,
            review: rating.review ?? undefined,
        user: rating.user as any,
      })),
    };
  }

  /**
   * Get resources with filters
   */
  static async getResources(params: ResourceSearchParams): Promise<PaginatedResponse<ResourceData>> {
    const {
      page = 1,
      limit = 20,
      subject,
      type,
      semester,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (subject) {
      where.subject = {
        contains: subject,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = type;
    }

    if (semester) {
      where.semester = semester;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get resources and total count
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              rollNumber: true,
              department: true,
              year: true,
              semester: true,
              bio: true,
              avatar: true,
              isVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  rollNumber: true,
                  department: true,
                  year: true,
                  semester: true,
                  bio: true,
                  avatar: true,
                  isVerified: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
          
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.resource.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: resources.map(resource => ({
        id: resource.id,
        title: resource.title,
  description: resource.description ?? undefined,
        type: resource.type as 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE',
        subject: resource.subject,
  semester: resource.semester ?? undefined,
  fileUrl: resource.fileUrl ?? undefined,
  fileName: resource.fileName ?? undefined,
  fileSize: resource.fileSize ?? undefined,
        downloads: resource.downloads,
        uploaderId: resource.uploaderId,
        createdAt: resource.createdAt,
        uploader: resource.uploader as any,
        ratings: resource.ratings.map(rating => ({
          id: rating.id,
          resourceId: rating.resourceId,
          userId: rating.userId,
          rating: rating.rating,
              review: rating.review ?? undefined,
          user: rating.user as any,
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get resource by ID
   */
  static async getResourceById(resourceId: string): Promise<ResourceData> {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                rollNumber: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          
        },
      },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    return {
      id: resource.id,
      title: resource.title,
      description: resource.description ?? undefined,
      type: resource.type as 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE',
      subject: resource.subject,
      semester: resource.semester ?? undefined,
      fileUrl: resource.fileUrl ?? undefined,
      fileName: resource.fileName ?? undefined,
      fileSize: resource.fileSize ?? undefined,
      downloads: resource.downloads,
      uploaderId: resource.uploaderId,
      createdAt: resource.createdAt,
      uploader: (resource as any).uploader as any,
      ratings: (resource as any).ratings.map((rating: any) => ({
        id: rating.id,
        resourceId: rating.resourceId,
        userId: rating.userId,
        rating: rating.rating,
        review: rating.review ?? undefined,
        user: (rating as any).user as any,
      })),
    };
  }

  /**
   * Update resource
   */
  static async updateResource(
    resourceId: string,
    userId: string,
    updateData: UpdateResourceData
  ): Promise<ResourceData> {
    // Check if resource exists and user is owner
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    if (resource.uploaderId !== userId) {
      throw new Error('Only resource owner can update the resource');
    }

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: updateData,
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                rollNumber: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return {
      id: updatedResource.id,
      title: updatedResource.title,
  description: updatedResource.description ?? undefined,
      type: updatedResource.type as 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE',
      subject: updatedResource.subject,
  semester: updatedResource.semester ?? undefined,
  fileUrl: updatedResource.fileUrl ?? undefined,
  fileName: updatedResource.fileName ?? undefined,
  fileSize: updatedResource.fileSize ?? undefined,
      downloads: updatedResource.downloads,
      uploaderId: updatedResource.uploaderId,
      createdAt: updatedResource.createdAt,
      uploader: updatedResource.uploader as any,
      ratings: updatedResource.ratings.map(rating => ({
        id: rating.id,
        resourceId: rating.resourceId,
        userId: rating.userId,
        rating: rating.rating,
            review: rating.review ?? undefined,
        user: rating.user as any,
      })),
    };
  }

  /**
   * Delete resource
   */
  static async deleteResource(resourceId: string, userId: string): Promise<{ message: string }> {
    // Check if resource exists and user is owner
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    if (resource.uploaderId !== userId) {
      throw new Error('Only resource owner can delete the resource');
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return { message: 'Resource deleted successfully' };
  }

  /**
   * Track resource download
   */
  static async trackDownload(resourceId: string): Promise<{ message: string }> {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    await prisma.resource.update({
      where: { id: resourceId },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    return { message: 'Download tracked successfully' };
  }

  /**
   * Rate resource
   */
  static async rateResource(
    resourceId: string,
    userId: string,
    ratingData: CreateResourceRatingData
  ): Promise<ResourceRatingData> {
    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check if user has already rated this resource
    const existingRating = await prisma.resourceRating.findUnique({
      where: {
        resourceId_userId: {
          resourceId,
          userId,
        },
      },
    });

    let resourceRating;

    if (existingRating) {
      // Update existing rating
      resourceRating = await prisma.resourceRating.update({
        where: {
          resourceId_userId: {
            resourceId,
            userId,
          },
        },
        data: ratingData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              rollNumber: true,
              department: true,
              year: true,
              semester: true,
              bio: true,
              avatar: true,
              isVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    } else {
      // Create new rating
      resourceRating = await prisma.resourceRating.create({
        data: {
          resourceId,
          userId,
          ...ratingData,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              rollNumber: true,
              department: true,
              year: true,
              semester: true,
              bio: true,
              avatar: true,
              isVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    }

    return {
      id: resourceRating.id,
      resourceId: resourceRating.resourceId,
      userId: resourceRating.userId,
      rating: resourceRating.rating,
      review: resourceRating.review,
      user: resourceRating.user as any,
    };
  }

  /**
   * Get resource ratings
   */
  static async getResourceRatings(resourceId: string): Promise<ResourceRatingData[]> {
    const ratings = await prisma.resourceRating.findMany({
      where: { resourceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
  // ResourceRating has no createdAt field in schema; remove ordering
    });

    return ratings.map(rating => ({
      id: rating.id,
      resourceId: rating.resourceId,
      userId: rating.userId,
      rating: rating.rating,
      review: rating.review ?? undefined,
      user: (rating as any).user as any,
    }));
  }

  /**
   * Get resource statistics
   */
  static async getResourceStats(resourceId: string): Promise<{
    totalDownloads: number;
    averageRating: number;
    totalRatings: number;
  }> {
    const [resource, ratings] = await Promise.all([
      prisma.resource.findUnique({
        where: { id: resourceId },
        select: { downloads: true },
      }),
      prisma.resourceRating.findMany({
        where: { resourceId },
        select: { rating: true },
      }),
    ]);

    if (!resource) {
      throw new Error('Resource not found');
    }

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0;

    return {
      totalDownloads: resource.downloads,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings,
    };
  }

  /**
   * Get popular resources
   */
  static async getPopularResources(limit: number = 10): Promise<ResourceData[]> {
    const resources = await prisma.resource.findMany({
      orderBy: { downloads: 'desc' },
      take: limit,
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                rollNumber: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description ?? undefined,
      type: resource.type as 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE',
      subject: resource.subject,
      semester: resource.semester ?? undefined,
      fileUrl: resource.fileUrl ?? undefined,
      fileName: resource.fileName ?? undefined,
      fileSize: resource.fileSize ?? undefined,
      downloads: resource.downloads,
      uploaderId: resource.uploaderId,
      createdAt: resource.createdAt,
      uploader: (resource as any).uploader as any,
      ratings: (resource as any).ratings.map((rating: any) => ({
        id: rating.id,
        resourceId: rating.resourceId,
        userId: rating.userId,
        rating: rating.rating,
        review: rating.review ?? undefined,
        user: (rating as any).user as any,
      })),
    }));
  }
}
