import express from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Get all staff - to be implemented' });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'Get current staff member profile - to be implemented' });
});

router.post('/', authenticate, authorize(['director', 'manager']), (req, res) => {
  res.json({ message: 'Create staff member - to be implemented' });
});

router.put('/:id', authenticate, authorize(['director', 'manager']), (req, res) => {
  res.json({ message: 'Update staff member - to be implemented' });
});

export default router;
