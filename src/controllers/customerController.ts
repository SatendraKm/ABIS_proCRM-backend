import { Request, Response } from 'express';
import { Customer } from '../models';
import { AppError } from '../utils/AppError';

export const getAllCustomer = async (req: Request, res: Response) => {
  res.send('this is testing of getting all customers');
};
