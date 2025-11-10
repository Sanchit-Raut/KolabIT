import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/environment';

// Ensure upload directory exists
const uploadDir = config.UPLOAD_PATH;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    // PDF
    'application/pdf',
    
    // Word documents
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    
    // Excel documents
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    // Text documents
    'text/plain',
    'text/markdown',
    
    // Archives
    'application/zip',
    'application/x-zip-compressed',
  ];

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.md', '.txt', '.zip'];

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file type. Only PDF, DOC, EXCEL, MD, TXT, or ZIP files are allowed.'));
  }

  // Check MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Please check if the file is corrupted.'));
  }

  // Additional validations can be added here
  cb(null, true);
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
});

export class FileUtils {
  /**
   * Get file extension
   */
  static getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }

  /**
   * Get file type from extension
   */
  static getFileType(filename: string): string {
    const ext = this.getFileExtension(filename);
    
    const typeMap: { [key: string]: string } = {
      '.pdf': 'PDF',
      '.doc': 'DOC',
      '.docx': 'DOC',
      '.txt': 'TEXT',
      '.zip': 'ARCHIVE',
      '.rar': 'ARCHIVE',
      '.mp4': 'VIDEO',
      '.avi': 'VIDEO',
      '.mov': 'VIDEO',
      '.jpg': 'IMAGE',
      '.jpeg': 'IMAGE',
      '.png': 'IMAGE',
      '.gif': 'IMAGE',
    };

    return typeMap[ext] || 'UNKNOWN';
  }

  /**
   * Check if file is image
   */
  static isImage(filename: string): boolean {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExts.includes(this.getFileExtension(filename));
  }

  /**
   * Check if file is video
   */
  static isVideo(filename: string): boolean {
    const videoExts = ['.mp4', '.avi', '.mov'];
    return videoExts.includes(this.getFileExtension(filename));
  }

  /**
   * Check if file is document
   */
  static isDocument(filename: string): boolean {
    const docExts = ['.pdf', '.doc', '.docx', '.txt'];
    return docExts.includes(this.getFileExtension(filename));
  }

  /**
   * Get file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Delete file
   */
  static deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Check if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Get file stats
   */
  static getFileStats(filePath: string): fs.Stats | null {
    try {
      return fs.statSync(filePath);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate unique filename
   */
  static generateUniqueFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const uniqueId = uuidv4();
    return `${name}_${uniqueId}${ext}`;
  }

  /**
   * Validate file size
   */
  static validateFileSize(size: number): boolean {
    return size <= config.MAX_FILE_SIZE;
  }

  /**
   * Get allowed file types
   */
  static getAllowedFileTypes(): string[] {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed',
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];
  }
}
