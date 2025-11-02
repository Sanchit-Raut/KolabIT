import jwt from 'jsonwebtoken';
import config from '../config/environment';
import { JWTPayload } from '../types';

export class JWTUtils {
  /**
   * Generate JWT token
   */
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decode JWT token without verification (for debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate email verification token
   */
  static generateEmailVerificationToken(email: string): string {
    return jwt.sign({ email, type: 'email_verification' }, config.JWT_SECRET, {
      expiresIn: '24h',
    });
  }

  /**
   * Generate password reset token
   */
  static generatePasswordResetToken(email: string): string {
    return jwt.sign({ email, type: 'password_reset' }, config.JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  /**
   * Verify email verification token
   */
  static verifyEmailVerificationToken(token: string): { email: string } {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid token type');
      }
      return { email: decoded.email };
    } catch (error) {
      throw new Error('Invalid or expired email verification token');
    }
  }

  /**
   * Verify password reset token
   */
  static verifyPasswordResetToken(token: string): { email: string } {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
      return { email: decoded.email };
    } catch (error) {
      throw new Error('Invalid or expired password reset token');
    }
  }
}
