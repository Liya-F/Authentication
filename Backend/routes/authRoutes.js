import express from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshtoken', refreshToken);

export default router;
