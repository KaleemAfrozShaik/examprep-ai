import express from 'express';
import { protect } from '../middlewares/protect.js';
import { pdfDownload } from '../controllers/pdf.controller.js';


const router = express.Router();

router.post('/generate-pdf',protect,pdfDownload);

export default router;

