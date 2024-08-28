import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import User from '../models/users.js'; 

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // Find the user by the ID stored in the JWT payload
        const user = await User.findById(req.user.id).select('-password'); // Exclude the password from the results

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'This is a protected route', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user profile', error: error.message });
    }
});

export default router;
