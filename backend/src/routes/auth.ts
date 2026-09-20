import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import AuthController from '../controllers/authController';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  AuthController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  AuthController.login
);

router.post('/logout', authenticate, AuthController.logout);

router.post('/refresh-token', AuthController.refreshToken);

router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
