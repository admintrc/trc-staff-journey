import express from 'express';
import { authenticate } from '../middleware/auth';
import HandbookController from '../controllers/handbookController';

const router = express.Router();

router.get('/', authenticate, HandbookController.getAllSections);
router.get('/part/:part', authenticate, HandbookController.getPartSections);
router.get('/search', authenticate, HandbookController.searchSections);
router.get('/:id', authenticate, HandbookController.getSectionById);

export default router;
