import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

const PEPPER = process.env.PEPPER;
const ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET;
const REFRESHTOKEN_SECRET = process.env.REFRESHTOKEN_SECRET;

export const registerUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        const pepperedPassword = password + PEPPER;
        console.log('Peppered Password (Registration):', pepperedPassword);

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(pepperedPassword, salt);
        console.log('Hashed Password:', hashedPassword);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const pepperedPassword = password + PEPPER;
        console.log('Peppered Password (Login):', pepperedPassword);

        const isMatch = await bcrypt.compare(pepperedPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
         // Generate the access token
        const accessToken = jwt.sign(
            { id: user._id, username: user.username },
            ACCESSTOKEN_SECRET,
            { expiresIn: '10m' }
        );

         // Generate the refresh token
         const refreshToken = jwt.sign(
            { id: user._id, username: user.username },
            REFRESHTOKEN_SECRET,
            { expiresIn: '7d' } // Refresh token expires in 7 days
        );

        res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESHTOKEN_SECRET);
        const accessToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            ACCESSTOKEN_SECRET,
            { expiresIn: '10m' } // Generate a new access token
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token', error: error.message });
    }
};
