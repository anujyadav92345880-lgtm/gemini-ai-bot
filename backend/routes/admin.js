const express = require('express');
const User = require('../models/User');
const Recharge = require('../models/Recharge');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecharges = await Recharge.countDocuments();
    const totalRevenue = await Recharge.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    res.json({
      totalUsers,
      totalRecharges,
      totalRevenue: totalRevenue[0]?.total || 0,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details
router.get('/user/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('transactions');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;