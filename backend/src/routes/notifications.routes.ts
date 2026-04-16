import { Router } from 'express';
import { registerDevice } from '../controllers/notifications.controller';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.use(verifyToken);
router.post('/register', registerDevice);

export default router;

