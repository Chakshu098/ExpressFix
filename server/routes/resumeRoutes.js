import express from 'express';
import { upload } from '../index.js';
import { reviewResume } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/review-resume', upload.single('resume'), reviewResume);

export { router as resumeRoutes };
