// src/routes/upload.js
import { Router } from 'express';
import { UploadController } from '../controllers/UploadController.js';
import { uploadImage } from '../middleware/upload.js';

const router = Router();

router.post('/', uploadImage, UploadController.uploadImage);

export default router;