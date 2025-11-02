import { Router } from 'express';
import { SkillService } from '../services/skillService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { searchLimiter } from '../middleware/rateLimit';

const router = Router();

// Get all skills
router.get('/', asyncHandler(async (req, res) => {
  const skills = await SkillService.getAllSkills();
  ResponseUtils.success(res, skills);
}));

// Get skills by category
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const skills = await SkillService.getSkillsByCategory(category);
  ResponseUtils.success(res, skills);
}));

// Get skill by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const skill = await SkillService.getSkillById(id);
  ResponseUtils.success(res, skill);
}));

// Search skills
router.get('/search/:term', searchLimiter, asyncHandler(async (req, res) => {
  const { term } = req.params;
  const { category } = req.query;
  const skills = await SkillService.searchSkills(term, category as string);
  ResponseUtils.success(res, skills);
}));

// Get skill categories
router.get('/categories/list', asyncHandler(async (req, res) => {
  const categories = await SkillService.getSkillCategories();
  ResponseUtils.success(res, categories);
}));

// Get popular skills
router.get('/popular/:limit?', asyncHandler(async (req, res) => {
  const limit = parseInt(req.params.limit) || 10;
  const skills = await SkillService.getPopularSkills(limit);
  ResponseUtils.success(res, skills);
}));

// Get skill statistics
router.get('/:id/stats', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stats = await SkillService.getSkillStats(id);
  ResponseUtils.success(res, stats);
}));

// Get skill leaderboard
router.get('/:id/leaderboard/:limit?', asyncHandler(async (req, res) => {
  const { id, limit } = req.params;
  const limitNum = parseInt(limit) || 10;
  const leaderboard = await SkillService.getSkillLeaderboard(id, limitNum);
  ResponseUtils.success(res, leaderboard);
}));

// Create skill (admin only - would need admin middleware)
router.post('/', asyncHandler(async (req, res) => {
  const skillData = req.body;
  const skill = await SkillService.createSkill(skillData);
  ResponseUtils.created(res, skill, 'Skill created successfully');
}));

// Update skill (admin only)
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const skill = await SkillService.updateSkill(id, updateData);
  ResponseUtils.success(res, skill, 'Skill updated successfully');
}));

// Delete skill (admin only)
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await SkillService.deleteSkill(id);
  ResponseUtils.success(res, result);
}));

export default router;
