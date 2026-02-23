import express from 'express';
import { protect } from '../middlewares/protect.js';
import { generateNotes } from '../controllers/generate.controller.js';
import { getMyNotes, getSingleNotes } from '../controllers/notes.controller.js';


const router =express.Router();

router.post('/generate-notes',protect,generateNotes);
router.get('/getnotes',protect,getMyNotes);
router.get('/:id',protect,getSingleNotes);

export default router;