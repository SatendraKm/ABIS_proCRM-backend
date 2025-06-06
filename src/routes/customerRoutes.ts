import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import {
  customers,
  getCustomerOrders,
  getCustomerStats,
  getCustomerSummary,
  getDashboardSummary,
} from '../controllers/customerController';
import { userAuth } from '../middlewares/auth';
import { getCustomerById } from '../controllers/customerController';

const router = Router();

router.get('/customers', userAuth, asyncHandler(customers));
router.get('/customers/:id', userAuth, asyncHandler(getCustomerById));
router.get('/:id/orders', userAuth, asyncHandler(getCustomerOrders));
router.get('/customers-stats', userAuth, asyncHandler(getCustomerStats));
router.get('/customers-summary/:id', userAuth, asyncHandler(getCustomerSummary));
router.get('/dashboard-summary', userAuth, asyncHandler(getDashboardSummary));

export default router;
