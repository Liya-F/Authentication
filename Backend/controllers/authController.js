import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

const PEPPER = process.env.PEPPER;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h'; // Token expiration time

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

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};
