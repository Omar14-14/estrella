import { Router } from 'express';
import { validatePin } from '../controllers/auth.controller';

const router = Router();

router.post('/validate-pin', validatePin);

export default router;
