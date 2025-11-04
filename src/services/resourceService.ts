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
  static async createResource(
    uploaderId: string,
    resourceData: CreateResourceData
  ): Promise<ResourceData> {
    const uploader = await prisma.users.findUnique({
      where: { id: uploaderId },
    });

    if (!uploader) {
      throw new Error('Uploader not found');
    }

    const resource = await prisma.resources.create({
      data: {
        ...resourceData,
        uploader_id: uploaderId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            roll_number: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            is_verified: true,
            created_at: true,
            updated_at: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                roll_number: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                is_verified: true,
                created_at: true,
                updated_at: true,
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
      file_url: resource.file_url ?? undefined,
      file_name: resource.file_name ?? undefined,
      file_size: resource.file_size ?? undefined,
      downloads: resource.downloads,
      uploader_id: resource.uploader_id,
      created_at: resource.created_at,
      uploader: resource.uploader as any,
      ratings: resource.ratings.map(rating => ({
        id: rating.id,
        resource_id: rating.resource_id,
        user_id: rating.user_id,
        rating: rating.rating,
        review: rating.review ?? undefined,
        user: rating.user as any,
      })),
    };
  }

  static async getResources(params: ResourceSearchParams): Promise<PaginatedResponse<ResourceData>> {
    const {
      page = 1,
      limit = 20,
      subject,
      type,
      semester,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (subject) {
      where.subject = { contains: subject, mode: 'insensitive' };
    }

    if (type) where.type = type;
    if (semester) where.semester = semester;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [resources, total] = await Promise.all([
      prisma.resources.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              roll_number: true,
              department: true,
              year: true,
              semester: true,
              bio: true,
              avatar: true,
              is_verified: true,
              created_at: true,
              updated_at: true,
            },
          },
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  first_name: true,
                  last_name: true,
                  roll_number: true,
                  department: true,
                  year: true,
                  semester: true,
                  bio: true,
                  avatar: true,
                  is_verified: true,
                  created_at: true,
                  updated_at: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.resources.count({ where }),
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
        file_url: resource.file_url ?? undefined,
        file_name: resource.file_name ?? undefined,
        file_size: resource.file_size ?? undefined,
        downloads: resource.downloads,
        uploader_id: resource.uploader_id,
        created_at: resource.created_at,
        uploader: resource.uploader as any,
        ratings: resource.ratings.map(rating => ({
          id: rating.id,
          resource_id: rating.resource_id,
          user_id: rating.user_id,
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

  static async getResourceById(resourceId: string): Promise<ResourceData> {
    const resource = await prisma.resources.findUnique({
      where: { id: resourceId },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            roll_number: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            is_verified: true,
            created_at: true,
            updated_at: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                roll_number: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                is_verified: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });

    if (!resource) throw new Error('Resource not found');

    return {
      id: resource.id,
      title: resource.title,
      description: resource.description ?? undefined,
      type: resource.type as 'PDF' | 'DOC' | 'VIDEO' | 'LINK' | 'CODE',
      subject: resource.subject,
      semester: resource.semester ?? undefined,
      file_url: resource.file_url ?? undefined,
      file_name: resource.file_name ?? undefined,
      file_size: resource.file_size ?? undefined,
      downloads: resource.downloads,
      uploader_id: resource.uploader_id,
      created_at: resource.created_at,
      uploader: (resource as any).uploader as any,
      ratings: (resource as any).ratings.map((rating: any) => ({
        id: rating.id,
        resource_id: rating.resource_id,
        user_id: rating.user_id,
        rating: rating.rating,
        review: rating.review ?? undefined,
        user: (rating as any).user as any,
      })),
    };
  }

  static async updateResource(
    resourceId: string,
    userId: string,
    updateData: UpdateResourceData
  ): Promise<ResourceData> {
    const resource = await prisma.resources.findUnique({
      where: { id: resourceId },
    });

    if (!resource) throw new Error('Resource not found');
    if (resource.uploader_id !== userId) throw new Error('Only resource owner can update the resource');

    const updatedResource = await prisma.resources.update({
      where: { id: resourceId },
      data: updateData,
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            roll_number: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            is_verified: true,
            created_at: true,
            updated_at: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                roll_number: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                is_verified: true,
                created_at: true,
                updated_at: true,
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
      file_url: updatedResource.file_url ?? undefined,
      file_name: updatedResource.file_name ?? undefined,
      file_size: updatedResource.file_size ?? undefined,
      downloads: updatedResource.downloads,
      uploader_id: updatedResource.uploader_id,
      created_at: updatedResource.created_at,
      uploader: updatedResource.uploader as any,
      ratings: updatedResource.ratings.map(rating => ({
        id: rating.id,
        resource_id: rating.resource_id,
        user_id: rating.user_id,
        rating: rating.rating,
        review: rating.review ?? undefined,
        user: rating.user as any,
      })),
    };
  }

  static async deleteResource(resourceId: string, userId: string): Promise<{ message: string }> {
    const resource = await prisma.resources.findUnique({ where: { id: resourceId } });
    if (!resource) throw new Error('Resource not found');
    if (resource.uploader_id !== userId) throw new Error('Only resource owner can delete the resource');

    await prisma.resources.delete({ where: { id: resourceId } });
    return { message: 'Resource deleted successfully' };
  }

  static async trackDownload(resourceId: string): Promise<{ message: string }> {
    const resource = await prisma.resources.findUnique({ where: { id: resourceId } });
    if (!resource) throw new Error('Resource not found');

    await prisma.resources.update({
      where: { id: resourceId },
      data: { downloads: { increment: 1 } },
    });

    return { message: 'Download tracked successfully' };
  }

  static async rateResource(
    resourceId: string,
    userId: string,
    ratingData: CreateResourceRatingData
  ): Promise<ResourceRatingData> {
    const resource = await prisma.resources.findUnique({ where: { id: resourceId } });
    if (!resource) throw new Error('Resource not found');

    const existingRating = await prisma.resource_ratings.findUnique({
      where: { resource_id_user_id: { resource_id: resourceId, user_id: userId } },
    });

    let resourceRating;

    if (existingRating) {
      resourceRating = await prisma.resource_ratings.update({
        where: { resource_id_user_id: { resource_id: resourceId, user_id: userId } },
        data: ratingData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              roll_number: true,
              department: true,
              year: true,
              semester: true,
              bio: true,
              avatar: true,
              is_verified: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
      });
    } else {
      resourceRating = await prisma.resource_ratings.create({
        data: { resource_id: resourceId, user_id: userId, ...ratingData },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              roll_number: true,
              department: true,
              year: true,
              semester: true,
              bio: true,
              avatar: true,
              is_verified: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
      });
    }

    return {
      id: resourceRating.id,
      resource_id: resourceRating.resource_id,
      user_id: resourceRating.user_id,
      rating: resourceRating.rating,
      review: resourceRating.review,
      user: resourceRating.user as any,
    };
  }

  static async getResourceRatings(resourceId: string): Promise<ResourceRatingData[]> {
    const ratings = await prisma.resource_ratings.findMany({
      where: { resource_id: resourceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            roll_number: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            is_verified: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    return ratings.map(rating => ({
      id: rating.id,
      resource_id: rating.resource_id,
      user_id: rating.user_id,
      rating: rating.rating,
      review: rating.review ?? undefined,
      user: (rating as any).user as any,
    }));
  }

  static async getResourceStats(resourceId: string): Promise<{ totalDownloads: number; averageRating: number; totalRatings: number }> {
    const [resource, ratings] = await Promise.all([
      prisma.resources.findUnique({ where: { id: resourceId }, select: { downloads: true } }),
      prisma.resource_ratings.findMany({ where: { resource_id: resourceId }, select: { rating: true } }),
    ]);

    if (!resource) throw new Error('Resource not found');

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0;

    return { totalDownloads: resource.downloads, averageRating: Math.round(averageRating * 10) / 10, totalRatings };
  }

  static async getPopularResources(limit: number = 10): Promise<ResourceData[]> {
    const resources = await prisma.resources.findMany({
      orderBy: { downloads: 'desc' },
      take: limit,
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            roll_number: true,
            department: true,
            year: true,
            semester: true,
            bio: true,
            avatar: true,
            is_verified: true,
            created_at: true,
            updated_at: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                roll_number: true,
                department: true,
                year: true,
                semester: true,
                bio: true,
                avatar: true,
                is_verified: true,
                created_at: true,
                updated_at: true,
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
      file_url: resource.file_url ?? undefined,
      file_name: resource.file_name ?? undefined,
      file_size: resource.file_size ?? undefined,
      downloads: resource.downloads,
      uploader_id: resource.uploader_id,
      created_at: resource.created_at,
      uploader: (resource as any).uploader as any,
      ratings: (resource as any).ratings.map((rating: any) => ({
        id: rating.id,
        resource_id: rating.resource_id,
        user_id: rating.user_id,
        rating: rating.rating,
        review: rating.review ?? undefined,
        user: (rating as any).user as any,
      })),
    }));
  }
}
