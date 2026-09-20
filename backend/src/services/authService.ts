import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateTokens(user: User): AuthTokens {
    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      return decoded as AuthPayload;
    } catch {
      return null;
    }
  }

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'staff' | 'manager' | 'director' = 'staff'
  ): Promise<User> {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await this.hashPassword(password);

    const user = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      status: 'active',
    });

    return user;
  }

  static async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await User.findOne({ where: { email } });
    if (!user || user.status !== 'active') {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await this.comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    await user.update({ lastLogin: new Date() });
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }
}

export default AuthService;
