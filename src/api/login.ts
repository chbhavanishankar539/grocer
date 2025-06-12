import express from 'express';
import { automateLogin } from '../automation/loginFlow.ts';
import { saveSession } from '../session/mongo.ts';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { phone_number, platform } = req.body;
  try {
    const session = await automateLogin(platform, phone_number);
    const session_id = await saveSession({
      phone_number,
      platform,
      ...session,
      createdAt: new Date(),
    });
    res.json({
      status: 'OTP_SENT',
      message: 'OTP has been sent to the provided phone number.',
      session_id,
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

export default router; 