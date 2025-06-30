import { Router } from 'express';
import { sendVerificationCode } from '../controllers/smsController.js';

const router = Router();

// Ruta para enviar código SMS
router.post('/send-code', sendVerificationCode);

export default router;