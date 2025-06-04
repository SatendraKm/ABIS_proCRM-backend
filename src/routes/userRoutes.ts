import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getUsers));
router.post('/', asyncHandler(createUser));

export default router;
