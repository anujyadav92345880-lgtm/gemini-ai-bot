const express = require('express');
const Razorpay = require('razorpay');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount, planId } = req.body;
    
    if (!amount || !planId) {
      return res.status(400).json({ error: 'Amount and Plan ID required' });
    }
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }
    
    // Verify signature (simplified - implement proper verification)
    res.json({
      success: true,
      message: 'Payment verified',
      paymentId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;