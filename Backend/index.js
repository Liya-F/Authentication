import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import protectedRoute from './routes/protectedRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoute);
app.get('/', (req, res) => {
    res.send('Welcome to the Authentication API');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
