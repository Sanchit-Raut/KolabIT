import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';

export class ReportController {
  static async createReport(req: Request, res: Response) {
    try {
      const { targetType, targetId, reason } = req.body;
      const reporterId = (req as any).user?.id;

      if (!reporterId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!targetType || !targetId || !reason) {
        return res.status(400).json({ 
          message: 'Target type, target ID, and reason are required' 
        });
      }

      if (!['POST', 'PROJECT', 'RESOURCE'].includes(targetType)) {
        return res.status(400).json({ 
          message: 'Invalid target type. Must be POST, PROJECT, or RESOURCE' 
        });
      }

      const report = await ReportService.createReport({
        reporterId,
        targetType,
        targetId,
        reason,
      });

      res.status(201).json({
        message: 'Content reported successfully',
        report,
      });
    } catch (error: any) {
      console.error('[Report Error]', error);
      res.status(500).json({ 
        message: 'Failed to create report', 
        error: error.message 
      });
    }
  }

  static async getReports(req: Request, res: Response) {
    try {
      const { status } = req.query;
      
      const reports = await ReportService.getReportsByStatus(status as string);

      res.json(reports);
    } catch (error: any) {
      console.error('[Report Error]', error);
      res.status(500).json({ 
        message: 'Failed to fetch reports', 
        error: error.message 
      });
    }
  }

  static async updateReportStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const report = await ReportService.updateReportStatus(id, status);

      res.json({
        message: 'Report status updated',
        report,
      });
    } catch (error: any) {
      console.error('[Report Error]', error);
      res.status(500).json({ 
        message: 'Failed to update report', 
        error: error.message 
      });
    }
  }

  static async getReportById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const report = await ReportService.getReportById(id);

      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      res.json(report);
    } catch (error: any) {
      console.error('[Report Error]', error);
      res.status(500).json({ 
        message: 'Failed to fetch report', 
        error: error.message 
      });
    }
  }
}
