import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolioController';
import { authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validation rules
const portfolioValidation = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('link')
    .isURL()
    .withMessage('Valid URL is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Valid URL is required for image'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),
  handleValidationErrors,
];

const updatePortfolioValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('link')
    .optional()
    .isURL()
    .withMessage('Valid URL is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Valid URL is required for image'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),
  handleValidationErrors,
];

const reorderValidation = [
  body('itemIds')
    .isArray({ min: 1 })
    .withMessage('Item IDs array is required'),
  body('itemIds.*')
    .isString()
    .withMessage('Each item ID must be a string'),
  handleValidationErrors,
];

// Protected routes (require authentication)
router.post('/', authenticateToken, portfolioValidation, PortfolioController.createPortfolio);
router.get('/my', authenticateToken, PortfolioController.getMyPortfolios);
router.put('/reorder', authenticateToken, reorderValidation, PortfolioController.reorderPortfolios);
router.get('/:id', authenticateToken, PortfolioController.getPortfolioById);
router.put('/:id', authenticateToken, updatePortfolioValidation, PortfolioController.updatePortfolio);
router.delete('/:id', authenticateToken, PortfolioController.deletePortfolio);

// Public routes
router.get('/user/:userId', PortfolioController.getUserPortfolios);

export default router;
