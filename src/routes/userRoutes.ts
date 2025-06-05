import { Router } from 'express';
import { signup, login, logout } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/login', asyncHandler(login));
router.post('/signup', asyncHandler(signup));
router.post('/logout', asyncHandler(logout));

export default router;
