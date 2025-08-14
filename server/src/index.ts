import dotenv from 'dotenv'; 
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
// Add this line with other imports
import carRoutes from './routes/carRoutes';


const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
// Add this line with other routes
app.use('/api/cars', carRoutes);

app.get('/', (_req: express.Request, res: express.Response) =>
  res.json({ message: 'Company Backend Server is running!' })
);

// Error handling middleware
app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  }
);

// 404 handler
app.use(/.*/, (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const startServer = async (): Promise<void> => {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI not set!');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} 😎`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
