import prisma from '../config/database';
import { JWTUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';
import { EmailUtils } from '../utils/email';
import { CreateUserData, UserProfile, JWTPayload } from '../types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: CreateUserData): Promise<{ user: UserProfile; token: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if roll number is already taken (if provided)
    if (userData.rollNumber) {
      const existingRollNumber = await prisma.user.findUnique({
        where: { rollNumber: userData.rollNumber },
      });

      if (existingRollNumber) {
        throw new Error('User with this roll number already exists');
      }
    }

    // Validate password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hashPassword(userData.password);

    // Generate verification token
    const verificationToken = JWTUtils.generateEmailVerificationToken(userData.email);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        verificationToken,
      },
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
    });

    // Send verification email
    try {
      console.log(`📧 Sending verification email to: ${userData.email}`);
      console.log(`🔑 Verification token: ${verificationToken.substring(0, 20)}...`);
      await EmailUtils.sendEmailVerification(userData.email, verificationToken);
      console.log(`✅ Verification email sent successfully to: ${userData.email}`);
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      // Don't throw error here, user is created successfully
    }

    // Generate JWT token
    const token = JWTUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: 'user',
    });

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      rollNumber: user.rollNumber ?? undefined,
      department: user.department ?? undefined,
      year: user.year ?? undefined,
      semester: user.semester ?? undefined,
      bio: user.bio ?? undefined,
      avatar: user.avatar ?? undefined,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userProfile, token };
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Verify password
    const isPasswordValid = await PasswordUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = JWTUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: 'user',
    });

    // Return user without password
    const { password: _, ...raw } = user;
    const userProfile: UserProfile = {
      id: raw.id,
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
      rollNumber: raw.rollNumber ?? undefined,
      department: raw.department ?? undefined,
      year: raw.year ?? undefined,
      semester: raw.semester ?? undefined,
      bio: raw.bio ?? undefined,
      avatar: raw.avatar ?? undefined,
      isVerified: raw.isVerified,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };

    return { user: userProfile, token };
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const { email } = JWTUtils.verifyEmailVerificationToken(token);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        return { message: 'Email already verified' };
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      // Send welcome email
      try {
        await EmailUtils.sendWelcomeEmail(user.email, user.firstName);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new Error('Invalid or expired verification token');
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<{ message: string }> {
    console.log('🔵 [AuthService] resendVerificationEmail called for:', email);
    
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('🔵 [AuthService] User found:', user ? `Yes (verified: ${user.isVerified})` : 'No');

    if (!user) {
      console.log('🔵 [AuthService] User not found, returning generic message');
      // Don't reveal if user exists
      return { message: 'If an account with that email exists and is unverified, a verification email has been sent' };
    }

    if (user.isVerified) {
      console.log('🔵 [AuthService] User already verified, returning message');
      return { message: 'This email is already verified' };
    }

    console.log('🔵 [AuthService] Generating new verification token...');
    // Generate new verification token
    const verificationToken = JWTUtils.generateEmailVerificationToken(email);

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
      },
    });

    // Send verification email
    try {
      console.log('🔄 [AuthService] Calling EmailUtils.sendEmailVerification...');
      await EmailUtils.sendEmailVerification(email, verificationToken);
      console.log('✅ [AuthService] Email sent successfully!');
    } catch (error) {
      console.error('❌ [AuthService] Failed to send verification email:');
      console.error('Error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw new Error('Failed to send verification email');
    }

    return { message: 'Verification email sent successfully' };
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If an account with that email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = JWTUtils.generatePasswordResetToken(email);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset email
    try {
      await EmailUtils.sendPasswordReset(email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    return { message: 'If an account with that email exists, a password reset link has been sent' };
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const { email } = JWTUtils.verifyPasswordResetToken(token);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.resetToken || user.resetToken !== token) {
        throw new Error('Invalid reset token');
      }

      if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        throw new Error('Reset token has expired');
      }

      // Validate new password strength
      const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Hash new password
      const hashedPassword = await PasswordUtils.hashPassword(newPassword);

      // Update user password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user as UserProfile;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    updateData: Partial<UserProfile>
  ): Promise<UserProfile> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
    });

    return user as UserProfile;
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await PasswordUtils.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password strength
    const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash new password
    const hashedPassword = await PasswordUtils.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Delete user account
   */
  static async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete all related records that have foreign key constraints
    // Using a transaction to ensure all deletes succeed or fail together
    await prisma.$transaction(async (tx) => {
      // First, find or create a system "Deleted User" account to transfer ownership
      let deletedUser = await tx.user.findFirst({
        where: { email: 'deleted@system.internal' },
      });

      if (!deletedUser) {
        // Create a system deleted user if it doesn't exist
        const hashedPassword = await PasswordUtils.hashPassword('system-account-no-login');
        deletedUser = await tx.user.create({
          data: {
            email: 'deleted@system.internal',
            password: hashedPassword,
            firstName: 'Deleted',
            lastName: 'User',
            isVerified: true,
          },
        });
      }

      // Transfer ownership of public contributions to deleted user account
      // This preserves posts, comments, resources, and projects
      await tx.post.updateMany({
        where: { authorId: userId },
        data: { authorId: deletedUser.id },
      });

      await tx.comment.updateMany({
        where: { authorId: userId },
        data: { authorId: deletedUser.id },
      });

      await tx.resource.updateMany({
        where: { uploaderId: userId },
        data: { uploaderId: deletedUser.id },
      });

      await tx.project.updateMany({
        where: { ownerId: userId },
        data: { ownerId: deletedUser.id },
      });

      // Now delete personal data
      // Delete user skills
      await tx.userSkill.deleteMany({
        where: { userId },
      });

      // Delete user badges
      await tx.userBadge.deleteMany({
        where: { userId },
      });

      // Delete join requests
      await tx.joinRequest.deleteMany({
        where: { userId },
      });

      // Delete certifications
      await tx.certification.deleteMany({
        where: { userId },
      });

      // Delete portfolios
      await tx.portfolio.deleteMany({
        where: { userId },
      });

      // Delete analytics
      await tx.analytic.deleteMany({
        where: { userId },
      });

      // Delete notifications
      await tx.notification.deleteMany({
        where: { userId },
      });

      // Delete sent and received messages
      await tx.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { recipientId: userId },
          ],
        },
      });

      // Delete project memberships
      await tx.projectMember.deleteMany({
        where: { userId },
      });

      // Delete tasks assigned to user
      await tx.task.updateMany({
        where: { assigneeId: userId },
        data: { assigneeId: null },
      });

      // Delete resource ratings
      await tx.resourceRating.deleteMany({
        where: { userId },
      });

      // Delete resource likes
      await tx.resourceLike.deleteMany({
        where: { userId },
      });

      // Delete post likes
      await tx.like.deleteMany({
        where: { userId },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return { message: 'Account deleted successfully' };
  }
}
