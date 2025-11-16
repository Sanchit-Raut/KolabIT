import * as nodemailer from 'nodemailer';
import config from '../config/environment';

export class EmailUtils {
  private static _transporter: any = null;

  private static getTransporter() {
    if (!this._transporter) {
      // Remove spaces from Gmail App Password
      const appPassword = config.EMAIL_SERVICE_KEY.replace(/\s/g, '');
      
      console.log('🔧 [EmailUtils] Initializing transporter...');
      console.log('📧 Email From:', config.EMAIL_FROM);
      console.log('🔑 Password length:', appPassword.length, '(should be 16)');
      console.log('🔑 Password (masked):', appPassword.substring(0, 4) + '****' + appPassword.substring(appPassword.length - 4));
      
      this._transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.EMAIL_FROM,
          pass: appPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      
      console.log('✅ [EmailUtils] Transporter created');
    }
    return this._transporter;
  }

  static async testConnection(): Promise<boolean> {
    try {
      await this.getTransporter().verify();
      return true;
    } catch (error) {
      return false;
    }
  }

  static async sendEmailVerification(email: string, token: string): Promise<void> {
    console.log(`📤 [EmailUtils] Preparing verification email for: ${email}`);
    console.log(`📤 [EmailUtils] Email config - From: ${config.EMAIL_FROM}`);
    console.log(`📤 [EmailUtils] Email config - Service Key exists: ${!!config.EMAIL_SERVICE_KEY}`);
    
    const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: `"KolabIT - No Reply" <${config.EMAIL_FROM}>`,
      to: email,
      subject: '🔐 Verify Your KolabIT Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #f97316; margin-bottom: 20px;">Welcome to KolabIT! 🎉</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for registering with KolabIT, your campus collaboration platform.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Please verify your email address to activate your account and start collaborating!
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #f97316; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Or copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
              This link will expire in 24 hours.<br>
              If you didn't create an account, please ignore this email.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} KolabIT. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
    
    console.log(`📤 [EmailUtils] Sending email to: ${email}`);
    const result = await this.getTransporter().sendMail(mailOptions);
    console.log(`✅ [EmailUtils] Email sent! Message ID: ${result.messageId}`);
  }

  static async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: `"KolabIT - No Reply" <${config.EMAIL_FROM}>`,
      to: email,
      subject: '🔑 Reset Your KolabIT Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #ef4444; margin-bottom: 20px;">🔑 Password Reset Request</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              We received a request to reset your KolabIT password.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #ef4444; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #ef4444; font-size: 14px; font-weight: bold; line-height: 1.6;">
              ⚠️ This link will expire in 1 hour.
            </p>
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} KolabIT. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
    await this.getTransporter().sendMail(mailOptions);
  }

  static async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `"KolabIT - No Reply" <${config.EMAIL_FROM}>`,
      to: email,
      subject: '🎉 Welcome to KolabIT - Get Started!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #f97316; margin-bottom: 20px;">Welcome, ${firstName}! 🎊</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Your email has been verified successfully! You're all set to start collaborating.
            </p>
            <h2 style="color: #374151; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">🚀 What You Can Do Now:</h2>
            <ul style="color: #374151; font-size: 15px; line-height: 2;">
              <li>🎯 <strong>Add Your Skills</strong> - Showcase what you're good at</li>
              <li>🤝 <strong>Create Projects</strong> - Start collaborating with peers</li>
              <li>📚 <strong>Share Resources</strong> - Help others learn and grow</li>
              <li>💬 <strong>Join Discussions</strong> - Connect with your campus community</li>
              <li>🏆 <strong>Earn Badges</strong> - Get recognized for your contributions</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${config.CLIENT_URL}/dashboard" 
                 style="background-color: #f97316; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
              Need help? Check out our guides or reach out to support.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} KolabIT. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
    await this.getTransporter().sendMail(mailOptions);
  }

  static async sendProjectInvitation(email: string, projectTitle: string, inviterName: string, projectId: string): Promise<void> {
    const projectUrl = `${config.CLIENT_URL}/projects/${projectId}`;
    const mailOptions = {
      from: `"KolabIT - No Reply" <${config.EMAIL_FROM}>`,
      to: email,
      subject: `🤝 You're Invited to Join "${projectTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #f97316; margin-bottom: 20px;">🤝 Project Invitation</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              <strong>${inviterName}</strong> has invited you to join:
            </p>
            <h2 style="color: #f97316; font-size: 22px; margin: 20px 0;">
              "${projectTitle}"
            </h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Click below to view the project details and accept the invitation:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${projectUrl}" 
                 style="background-color: #f97316; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View Project
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Or copy and paste this link into your browser:<br>
              <a href="${projectUrl}" style="color: #3b82f6; word-break: break-all;">${projectUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
              This invitation was sent via KolabIT.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} KolabIT. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };
    await this.getTransporter().sendMail(mailOptions);
  }
}
