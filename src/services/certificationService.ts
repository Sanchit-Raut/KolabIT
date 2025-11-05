import { PrismaClient } from '@prisma/client';
import { CreateCertificationData, UpdateCertificationData } from '../types';

const prisma = new PrismaClient();

export class CertificationService {
  /**
   * Create new certification
   */
  static async createCertification(userId: string, data: CreateCertificationData) {
    try {
      const certification = await prisma.certification.create({
        data: {
          userId,
          name: data.name,
          issuer: data.issuer,
          date: new Date(data.date),
          imageUrl: data.imageUrl,
        },
      });

      return certification;
    } catch (error: any) {
      throw new Error('Failed to create certification');
    }
  }

  /**
   * Get all certifications for a user
   */
  static async getUserCertifications(userId: string) {
    try {
      const certifications = await prisma.certification.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });

      return certifications;
    } catch (error: any) {
      throw new Error('Failed to fetch certifications');
    }
  }

  /**
   * Get certification by ID
   */
  static async getCertificationById(id: string, userId: string) {
    try {
      const certification = await prisma.certification.findFirst({
        where: { id, userId },
      });

      if (!certification) {
        throw new Error('Certification not found');
      }

      return certification;
    } catch (error: any) {
      if (error.message === 'Certification not found') throw error;
      throw new Error('Failed to fetch certification');
    }
  }

  /**
   * Update certification
   */
  static async updateCertification(id: string, userId: string, data: UpdateCertificationData) {
    try {
      // Check ownership
      const existing = await prisma.certification.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error('Certification not found');
      }

      const updateData: any = { ...data };
      if (data.date) {
        updateData.date = new Date(data.date);
      }

      const updated = await prisma.certification.update({
        where: { id },
        data: updateData,
      });

      return updated;
    } catch (error: any) {
      if (error.message === 'Certification not found') throw error;
      throw new Error('Failed to update certification');
    }
  }

  /**
   * Delete certification
   */
  static async deleteCertification(id: string, userId: string) {
    try {
      // Check ownership
      const existing = await prisma.certification.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error('Certification not found');
      }

      await prisma.certification.delete({
        where: { id },
      });

      return { message: 'Certification deleted successfully' };
    } catch (error: any) {
      if (error.message === 'Certification not found') throw error;
      throw new Error('Failed to delete certification');
    }
  }
}
