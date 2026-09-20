import express from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: 'Get dashboard metrics - to be implemented' });
});

router.get('/monthly-hr-report', authenticate, authorize(['director']), (req, res) => {
  res.json({ message: 'Get monthly HR report - to be implemented' });
});

router.get('/compliance', authenticate, authorize(['director', 'manager']), (req, res) => {
  res.json({ message: 'Get compliance report - to be implemented' });
});

export default router;
