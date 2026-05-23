const express = require('express');
const Recharge = require('../models/Recharge');
const Plan = require('../models/Plan');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create recharge
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { planId, paymentId } = req.body;
    
    if (!planId || !paymentId) {
      return res.status(400).json({ error: 'Plan ID and Payment ID required' });
    }
    
    const plan = await Plan.findOne({ planId });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.validityDays);
    
    const recharge = new Recharge({
      userId: req.user.id,
      planId: plan.planId,
      mbAmount: plan.mbAmount,
      price: plan.price,
      validityDays: plan.validityDays,
      expiryDate,
      paymentId,
      paymentStatus: 'completed'
    });
    
    await recharge.save();
    
    // Update user's current MB
    const user = await User.findById(req.user.id);
    user.currentMB += plan.mbAmount;
    user.rechargeExpiryDate = expiryDate;
    await user.save();
    
    res.status(201).json({
      message: 'Recharge successful',
      recharge,
      userData: {
        currentMB: user.currentMB,
        expiryDate: user.rechargeExpiryDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user recharge history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const recharges = await Recharge.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(recharges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user data
router.get('/user-data', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      currentMB: user.currentMB,
      storedMB: user.storedMB,
      expiryDate: user.rechargeExpiryDate,
      totalMB: user.currentMB + user.storedMB
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;