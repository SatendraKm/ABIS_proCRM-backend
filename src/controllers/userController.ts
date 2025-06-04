import { Request, Response } from 'express';
import Users from '../models/User';
import { AppError } from '../utils/AppError';

export const getUsers = async (_req: Request, res: Response) => {
  const users = await Users.findAll();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new AppError('Name and email are required');
  }
  const existingUser = await Users.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists');
  }
  // const user = await Users.create({ name, email });
  // res.status(201).json(user);
};
