import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userAuth } from '../middlewares/auth';
import { getAllProducts, getProductById } from '../controllers/productController';

const router = Router();

router.get('/products', userAuth, asyncHandler(getAllProducts));
router.get('/product/:id', userAuth, asyncHandler(getProductById));
// router.get('/order-items/:id', userAuth, asyncHandler(getOrderById));

export default router;
