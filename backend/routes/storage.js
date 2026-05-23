const express = require('express');
const Storage = require('../models/Storage');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Store MB
router.post('/store', authMiddleware, async (req, res) => {
  try {
    const { mbAmount } = req.body;
    
    if (!mbAmount || mbAmount <= 0) {
      return res.status(400).json({ error: 'Valid MB amount required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (user.currentMB < mbAmount) {
      return res.status(400).json({ error: 'Insufficient current MB' });
    }
    
    const balanceBefore = user.storedMB;
    user.currentMB -= mbAmount;
    user.storedMB += mbAmount;
    await user.save();
    
    const storage = new Storage({
      userId: req.user.id,
      mbAmount,
      action: 'store',
      reason: 'User stored MB for future use',
      balanceBefore,
      balanceAfter: user.storedMB
    });
    
    await storage.save();
    
    res.status(201).json({
      message: 'MB stored successfully',
      storage,
      userData: {
        currentMB: user.currentMB,
        storedMB: user.storedMB
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use Stored MB
router.post('/use', authMiddleware, async (req, res) => {
  try {
    const { mbAmount } = req.body;
    
    if (!mbAmount || mbAmount <= 0) {
      return res.status(400).json({ error: 'Valid MB amount required' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if recharge is expired
    if (user.rechargeExpiryDate && new Date() > user.rechargeExpiryDate) {
      // Current MB expired, use stored MB
      if (user.storedMB < mbAmount) {
        return res.status(400).json({ error: 'Insufficient stored MB' });
      }
      
      const balanceBefore = user.storedMB;
      user.storedMB -= mbAmount;
      await user.save();
      
      const storage = new Storage({
        userId: req.user.id,
        mbAmount,
        action: 'use',
        reason: 'Used stored MB after recharge expiry',
        balanceBefore,
        balanceAfter: user.storedMB
      });
      
      await storage.save();
      
      return res.json({
        message: 'Stored MB used successfully',
        storage,
        userData: {
          currentMB: user.currentMB,
          storedMB: user.storedMB
        }
      });
    } else {
      return res.status(400).json({ error: 'Current recharge is still active. Store MB instead.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get storage history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const storage = await Storage.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(storage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;