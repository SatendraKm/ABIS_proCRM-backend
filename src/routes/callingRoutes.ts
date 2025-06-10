import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getAuthToken, initiateCall } from '../controllers/callingController';

const router = Router();

router.post('/get-auth-token', asyncHandler(getAuthToken));
router.post('/initiate-call', asyncHandler(initiateCall));

export default router;
