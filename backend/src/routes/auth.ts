import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - to be implemented' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' });
});

router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logout endpoint - to be implemented' });
});

router.post('/refresh-token', (req, res) => {
  res.json({ message: 'Refresh token endpoint - to be implemented' });
});

export default router;
