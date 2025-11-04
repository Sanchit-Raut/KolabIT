import prisma from '../config/database';
import {
  PostData,
  CreatePostData,
  UpdatePostData,
  PostSearchParams,
  CommentData,
  CreateCommentData,
  UpdateCommentData,
  PaginatedResponse,
} from '../types';

export class PostService {
  /**
   * Create new post
   */
  static async createPost(authorId: string, postData: CreatePostData): Promise<PostData> {
    const post = await prisma.post.create({
      data: {
        ...postData,
        author_id: authorId,
      },
      include: {
        author: {
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
        comments: {
          include: {
            author: {
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
          orderBy: { created_at: 'asc' },
        },
        likes: {
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
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type as 'DISCUSSION' | 'ANNOUNCEMENT' | 'HELP' | 'SHOWCASE',
      tags: post.tags,
      authorId: post.author_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: post.author as any,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        postId: comment.post_id,
        authorId: comment.author_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        author: comment.author as any,
      })),
      likes: post.likes.map(like => ({
        id: like.id,
        postId: like.post_id,
        userId: like.user_id,
        user: like.user as any,
      })),
    };
  }

  /**
   * Get posts with filters
   */
  static async getPosts(params: PostSearchParams): Promise<PaginatedResponse<PostData>> {
    const {
      page = 1,
      limit = 20,
      type,
      tags = [],
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    const sortByMap: any = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
    orderBy[sortByMap[sortBy] || sortBy] = sortOrder;

    // Get posts and total count
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
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
          comments: {
            include: {
              author: {
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
            orderBy: { created_at: 'asc' },
          },
          likes: {
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
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type as 'DISCUSSION' | 'ANNOUNCEMENT' | 'HELP' | 'SHOWCASE',
        tags: post.tags,
        authorId: post.author_id,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: post.author as any,
        comments: post.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          postId: comment.post_id,
          authorId: comment.author_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          author: comment.author as any,
        })),
        likes: post.likes.map(like => ({
          id: like.id,
          postId: like.post_id,
          userId: like.user_id,
          user: like.user as any,
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
   * Get post by ID
   */
  static async getPostById(postId: string): Promise<PostData> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
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
        comments: {
          include: {
            author: {
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
          orderBy: { created_at: 'asc' },
        },
        likes: {
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

    if (!post) {
      throw new Error('Post not found');
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type as 'DISCUSSION' | 'ANNOUNCEMENT' | 'HELP' | 'SHOWCASE',
      tags: post.tags,
      authorId: post.author_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: post.author as any,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        postId: comment.post_id,
        authorId: comment.author_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        author: comment.author as any,
      })),
      likes: post.likes.map(like => ({
        id: like.id,
        postId: like.post_id,
        userId: like.user_id,
        user: like.user as any,
      })),
    };
  }

  /**
   * Update post
   */
  static async updatePost(
    postId: string,
    userId: string,
    updateData: UpdatePostData
  ): Promise<PostData> {
    // Check if post exists and user is author
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author_id !== userId) {
      throw new Error('Only post author can update the post');
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: {
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
        comments: {
          include: {
            author: {
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
          orderBy: { created_at: 'asc' },
        },
        likes: {
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
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      type: updatedPost.type as 'DISCUSSION' | 'ANNOUNCEMENT' | 'HELP' | 'SHOWCASE',
      tags: updatedPost.tags,
      authorId: updatedPost.author_id,
      createdAt: updatedPost.created_at,
      updatedAt: updatedPost.updated_at,
      author: updatedPost.author as any,
      comments: updatedPost.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        postId: comment.post_id,
        authorId: comment.author_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        author: comment.author as any,
      })),
      likes: updatedPost.likes.map(like => ({
        id: like.id,
        postId: like.post_id,
        userId: like.user_id,
        user: like.user as any,
      })),
    };
  }

  /**
   * Delete post
   */
  static async deletePost(postId: string, userId: string): Promise<{ message: string }> {
    // Check if post exists and user is author
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author_id !== userId) {
      throw new Error('Only post author can delete the post');
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Post deleted successfully' };
  }

  /**
   * Create comment
   */
  static async createComment(
    postId: string,
    authorId: string,
    commentData: CreateCommentData
  ): Promise<CommentData> {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const comment = await prisma.comment.create({
      data: {
        ...commentData,
        post_id: postId,
        author_id: authorId,
      },
      include: {
        author: {
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

    return {
      id: comment.id,
      content: comment.content,
      postId: comment.post_id,
      authorId: comment.author_id,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      author: comment.author as any,
    };
  }

  /**
   * Update comment
   */
  static async updateComment(
    postId: string,
    commentId: string,
    userId: string,
    updateData: UpdateCommentData
  ): Promise<CommentData> {
    // Check if comment exists and belongs to post
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.post_id !== postId) {
      throw new Error('Comment does not belong to this post');
    }

    if (comment.author_id !== userId) {
      throw new Error('Only comment author can update the comment');
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: updateData,
      include: {
        author: {
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

    return {
      id: updatedComment.id,
      content: updatedComment.content,
      postId: updatedComment.post_id,
      authorId: updatedComment.author_id,
      createdAt: updatedComment.created_at,
      updatedAt: updatedComment.updated_at,
      author: updatedComment.author as any,
    };
  }

  /**
   * Delete comment
   */
  static async deleteComment(
    postId: string,
    commentId: string,
    userId: string
  ): Promise<{ message: string }> {
    // Check if comment exists and belongs to post
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.post_id !== postId) {
      throw new Error('Comment does not belong to this post');
    }

    if (comment.author_id !== userId) {
      throw new Error('Only comment author can delete the comment');
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }

  /**
   * Like/unlike post
   */
  static async likePost(postId: string, userId: string): Promise<{ message: string; liked: boolean }> {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: userId,
          },
        },
      });

      return { message: 'Post unliked successfully', liked: false };
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          post_id: postId,
          user_id: userId,
        },
      });

      return { message: 'Post liked successfully', liked: true };
    }
  }
}