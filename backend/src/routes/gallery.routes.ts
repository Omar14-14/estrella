import { Router } from 'express';
import { getImages, saveImage, deleteImage } from '../controllers/gallery.controller';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.use(verifyToken);
router.get('/', getImages);
router.post('/', saveImage);
router.delete('/:id', deleteImage);

export default router;
