const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mbAmount: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    enum: ['store', 'use'],
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Storage', storageSchema);