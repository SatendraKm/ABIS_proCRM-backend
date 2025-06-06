import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userAuth } from '../middlewares/auth';
import { getAllOrderItems } from '../controllers/orderItemController';

const router = Router();

router.get('/order-items', userAuth, asyncHandler(getAllOrderItems));
// router.get('/order-items/:id', userAuth, asyncHandler(getOrderById));

export default router;
