import express from 'express';
import { uploadImage } from '../controllers/uploadController.js'; // cloudinary method
import { upload } from '../utils/imageUpload.js';//multer's method
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/image', isAuth, isAdmin, upload.single('image'), uploadImage);

export default router;
