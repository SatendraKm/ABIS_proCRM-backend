import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createCustomerFeedback,
  getCustomerFeedback,
} from '../controllers/customerFeedbackController';
// import { userAuth } from '../middlewares/auth';

const router = Router();

router.get('/all-feedback', asyncHandler(getCustomerFeedback));
router.post('/new-feedback', asyncHandler(createCustomerFeedback));

export default router;
