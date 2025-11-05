import { Router } from 'express';
import { CertificationController } from '../controllers/certificationController';
import { authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validation rules
const certificationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Certification name must be between 2 and 200 characters'),
  body('issuer')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Issuer name must be between 2 and 200 characters'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Valid URL is required for image'),
  handleValidationErrors,
];

const updateCertificationValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Certification name must be between 2 and 200 characters'),
  body('issuer')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Issuer name must be between 2 and 200 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Valid URL is required for image'),
  handleValidationErrors,
];

// Protected routes (require authentication)
router.post('/', authenticateToken, certificationValidation, CertificationController.createCertification);
router.get('/my', authenticateToken, CertificationController.getMyCertifications);
router.get('/:id', authenticateToken, CertificationController.getCertificationById);
router.put('/:id', authenticateToken, updateCertificationValidation, CertificationController.updateCertification);
router.delete('/:id', authenticateToken, CertificationController.deleteCertification);

// Public routes
router.get('/user/:userId', CertificationController.getUserCertifications);

export default router;
