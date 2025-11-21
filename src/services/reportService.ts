import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportService {
  static async createReport(data: {
    reporterId: string;
    targetType: 'POST' | 'PROJECT' | 'RESOURCE';
    targetId: string;
    reason: string;
  }) {
    // Create the report
    const report = await prisma.report.create({
      data: {
        reporterId: data.reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason,
        status: 'PENDING',
      },
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get all admins
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      select: {
        id: true,
      },
    });

    // Get content details for notification
    let contentTitle = '';
    let contentUrl = '';
    
    switch (data.targetType) {
      case 'POST':
        const post = await prisma.post.findUnique({
          where: { id: data.targetId },
          select: { title: true },
        });
        contentTitle = post?.title || 'a post';
        contentUrl = `/community/${data.targetId}`;
        break;
      
      case 'PROJECT':
        const project = await prisma.project.findUnique({
          where: { id: data.targetId },
          select: { title: true },
        });
        contentTitle = project?.title || 'a project';
        contentUrl = `/projects/${data.targetId}`;
        break;
      
      case 'RESOURCE':
        const resource = await prisma.resource.findUnique({
          where: { id: data.targetId },
          select: { title: true },
        });
        contentTitle = resource?.title || 'a resource';
        contentUrl = `/resources/${data.targetId}`;
        break;
    }

    // Create notifications for all admins
    const notifications = admins.map((admin) => ({
      userId: admin.id,
      type: 'CONTENT_REPORTED',
      title: `Content Reported`,
      message: `${report.reporter.firstName} ${report.reporter.lastName} reported ${contentTitle}`,
      data: {
        reportId: report.id,
        reporterId: data.reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        contentUrl,
      },
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return report;
  }

  static async getReportsByStatus(status?: string) {
    return await prisma.report.findMany({
      where: status ? { status } : undefined,
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async updateReportStatus(reportId: string, status: string) {
    return await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
  }

  static async getReportById(reportId: string) {
    return await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
