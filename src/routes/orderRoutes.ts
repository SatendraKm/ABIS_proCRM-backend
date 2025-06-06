import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userAuth } from '../middlewares/auth';
import { getAllOrders, getOrderById } from '../controllers/orderController';

const router = Router();

router.get('/orders', userAuth, asyncHandler(getAllOrders));
router.get('/orders/:id', userAuth, asyncHandler(getOrderById));

export default router;
