import express from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Get all forms - to be implemented' });
});

router.post('/:formType', authenticate, (req, res) => {
  res.json({ message: 'Submit form - to be implemented' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get form details - to be implemented' });
});

export default router;
