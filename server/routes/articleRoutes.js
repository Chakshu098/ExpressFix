import express from 'express';
import { generateArticle } from '../controllers/articleController.js';

const router = express.Router();

router.post('/article', generateArticle);

export { router as articleRoutes };
