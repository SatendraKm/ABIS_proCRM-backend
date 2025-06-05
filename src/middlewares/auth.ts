import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend the Request type to include user
interface AuthenticatedRequest extends Request {
  user?: typeof User.prototype;
}

export const userAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT secret key not configured');
    }

    const decoded = jwt.verify(token, secretKey) as { userId: number };

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
};
