import express from 'express';
import { getProfile, updateUserProfile } from '../controller/user.js';
import  {authMiddleware}  from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);

router.put('/me', authMiddleware, updateUserProfile);

// Example route for user registration
export default router