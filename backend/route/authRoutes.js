import express from 'express';
import { loginUser, registerUser } from '../controller/auth.js';

const router = express.Router();

router.post('/register',registerUser),

router.post('/login',loginUser);

// Example route for user registration
export default router