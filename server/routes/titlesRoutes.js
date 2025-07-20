import express from 'express';
import { generateTitles } from '../controllers/titlesController.js';

const router = express.Router();

router.post('/titles', generateTitles);

export { router as titlesRoutes };
