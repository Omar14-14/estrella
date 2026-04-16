import { Router } from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/diary.controller';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.use(verifyToken);
router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
