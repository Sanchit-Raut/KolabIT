import nodemailer from 'nodemailer';
import config from '../config/environment';

export class EmailUtils {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_FROM,
      pass: config.EMAIL_SERVICE_KEY,
    },
  });

  /**
   * Send email verification
   */
  static async sendEmailVerification(email: string, token: string): Promise<void> {
    const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Verify Your KolabIT Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to KolabIT!</h2>
          <p>Thank you for registering with KolabIT. Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Reset Your KolabIT Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password for your KolabIT account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Welcome to KolabIT!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to KolabIT, ${firstName}!</h2>
          <p>Your account has been successfully verified. You can now start exploring the platform and connecting with other students.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What you can do:</h3>
            <ul style="color: #666;">
              <li>Share your skills and find collaborators</li>
              <li>Join or create projects</li>
              <li>Share and download resources</li>
              <li>Participate in community discussions</li>
              <li>Earn badges and achievements</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.CLIENT_URL}" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Get Started
            </a>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send project invitation email
   */
  static async sendProjectInvitation(
    email: string, 
    projectTitle: string, 
    inviterName: string, 
    projectId: string
  ): Promise<void> {
    const projectUrl = `${config.CLIENT_URL}/projects/${projectId}`;
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: email,
      subject: `You've been invited to join "${projectTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Project Invitation</h2>
          <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectTitle}"</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${projectUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Project
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${projectUrl}</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
