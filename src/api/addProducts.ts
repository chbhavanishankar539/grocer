import express from 'express';
import { getSession } from '../session/mongo.ts';
import { addProductsToCartWithSession } from '../automation/loginFlow.ts';

const router = express.Router();

router.post('/add-products', async (req, res) => {
  const { session_id, product_urls, variants } = req.body;
  try {
    const session = await getSession(session_id);
    if (!session) {
      return res.status(404).json({ status: 'ERROR', message: 'Session not found' });
    }
    const { cart_details, final_price } = await addProductsToCartWithSession(session, product_urls, variants);
    res.json({
      cart_details,
      final_price,
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

export default router; 