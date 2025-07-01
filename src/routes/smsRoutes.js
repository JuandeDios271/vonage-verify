import { Router } from 'express';
import { sendVerificationCode, verifySmsCode } from '../controllers/smsController.js';

const router = Router();

// Send SMS code
router.post( '/send-code', sendVerificationCode );

// Verify recieved code
router.post( '/verify-code', verifySmsCode );

export default router;