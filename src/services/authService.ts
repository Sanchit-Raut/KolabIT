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
        where: { roll_number: userData.rollNumber },
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
        verification_token: verificationToken,
      },
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
    });

    // Send verification email
    try {
      await EmailUtils.sendEmailVerification(userData.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
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
      firstName: user.first_name,
      lastName: user.last_name,
      rollNumber: user.roll_number ?? undefined,
      department: user.department ?? undefined,
      year: user.year ?? undefined,
      semester: user.semester ?? undefined,
      bio: user.bio ?? undefined,
      avatar: user.avatar ?? undefined,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
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
    if (!user.is_verified) {
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
      firstName: raw.first_name,
      lastName: raw.last_name,
      rollNumber: raw.roll_number ?? undefined,
      department: raw.department ?? undefined,
      year: raw.year ?? undefined,
      semester: raw.semester ?? undefined,
      bio: raw.bio ?? undefined,
      avatar: raw.avatar ?? undefined,
      isVerified: raw.is_verified,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
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

      if (user.is_verified) {
        return { message: 'Email already verified' };
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          is_verified: true,
          verification_token: null,
        },
      });

      // Send welcome email
      try {
        await EmailUtils.sendWelcomeEmail(user.email, user.first_name);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new Error('Invalid or expired verification token');
    }
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
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
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

      if (!user.reset_token || user.reset_token !== token) {
        throw new Error('Invalid reset token');
      }

      if (!user.reset_token_expiry || user.reset_token_expiry < new Date()) {
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
          reset_token: null,
          reset_token_expiry: null,
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
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      rollNumber: user.roll_number ?? undefined,
      department: user.department ?? undefined,
      year: user.year ?? undefined,
      semester: user.semester ?? undefined,
      bio: user.bio ?? undefined,
      avatar: user.avatar ?? undefined,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
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
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      rollNumber: user.roll_number ?? undefined,
      department: user.department ?? undefined,
      year: user.year ?? undefined,
      semester: user.semester ?? undefined,
      bio: user.bio ?? undefined,
      avatar: user.avatar ?? undefined,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
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

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }
}