import { Request, Response } from 'express';
import Users from '../models/User';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role, EmployeeId } = req.body;
  if (!name || !EmployeeId || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }
  const existingUser = await Users.findOne({ where: { EmployeeId } });
  if (existingUser) {
    throw new AppError('User with this EmployeeId already exists', 400);
  }
  // const hashedPassword = await bcrypt.hash(password, 10);
  const user = await Users.create({
    name,
    EmployeeId,
    email,
    password,
    // password: hashedPassword,
    role: role || 'agent',
    isActive: true,
  });
  res.status(201).json({
    message: 'User created',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req: Request, res: Response) => {
  const { EmployeeId, password } = req.body;
  if (!EmployeeId || !password) {
    throw new AppError('Email and password are required', 400);
  }
  const user = await Users.findOne({ where: { EmployeeId } });
  if (!user) {
    throw new AppError('Invalid EmployeeId or password', 401);
  }
  // const isMatch = await bcrypt.compare(password, user.password);

  if (password !== user.password) {
    throw new AppError('Invalid EmployeeId or password', 401);
  }
  const secretKey = process.env.JWT_SECRET_KEY as string;
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      EmployeeId: EmployeeId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
