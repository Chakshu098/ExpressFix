import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { articleRoutes } from './routes/articleRoutes.js';
import { titlesRoutes } from './routes/titlesRoutes.js';
import { imageRoutes } from './routes/imageRoutes.js';
import { resumeRoutes } from './routes/resumeRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });

// Routes
app.use('/api', articleRoutes);
app.use('/api', titlesRoutes);
app.use('/api', imageRoutes);
app.use('/api', resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
