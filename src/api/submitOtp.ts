import express from 'express';
import { getSession, saveSession } from '../session/mongo.ts';
import { submitOtpWithSession } from '../automation/loginFlow.ts';

const router = express.Router();

router.post('/submit-otp', async (req, res) => {
  const { otp, session_id } = req.body;
  try {
    const session = await getSession(session_id);
    if (!session) {
      return res.status(404).json({ status: 'ERROR', message: 'Session not found' });
    }
    // Use selectors for OTP and submit button
    const platform = session.platform;
    const selectors = await import(`../config/selectors.ts`).then(m => m.selectors);
    session.otpInputSelector = selectors[platform].otpInput;
    session.submitButtonSelector = selectors[platform].submitButton;
    // Automate OTP submission
    const newSessionState = await submitOtpWithSession(session, otp);
    const newSessionId = await saveSession({
      ...session,
      ...newSessionState,
      updatedAt: new Date(),
    });
    res.json({
      status: 'SUCCESS',
      message: 'User authenticated and session saved.',
      session_id: newSessionId,
      session_data: newSessionState,
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

export default router; 