import express from 'express';
import { upload } from '../index.js';
import { 
  generateImage, 
  removeBackground, 
  removeObject 
} from '../controllers/imageController.js';

const router = express.Router();

router.post('/generate-image', generateImage);
router.post('/remove-bg', upload.single('image'), removeBackground);
router.post('/remove-object', upload.single('image'), removeObject);

export { router as imageRoutes };
