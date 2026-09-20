import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AuthService from '../services/authService';
import User from '../models/User';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password, firstName, lastName, role } = req.body;

      const user = await AuthService.register(email, password, firstName, lastName, role);
      const tokens = AuthService.generateTokens(user);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          tokens,
        },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      const { user, tokens } = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          tokens,
        },
      });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  static async getCurrentUser(req: any, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['passwordHash'] },
      });

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ success: false, error: 'Refresh token required' });
      }

      const payload = AuthService.verifyToken(refreshToken);
      if (!payload) {
        return res.status(401).json({ success: false, error: 'Invalid refresh token' });
      }

      const user = await User.findByPk(payload.id);
      if (!user || user.status !== 'active') {
        return res.status(401).json({ success: false, error: 'User not found or inactive' });
      }

      const tokens = AuthService.generateTokens(user);

      res.status(200).json({
        success: true,
        data: { tokens },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default AuthController;
