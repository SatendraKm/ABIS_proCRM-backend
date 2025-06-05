import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getAllCustomer } from '../controllers/customerController';
import { userAuth } from '../middlewares/auth';

const router = Router();

router.get('/getAllCustomers', userAuth, asyncHandler(getAllCustomer));

export default router;
