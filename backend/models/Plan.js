const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  mbAmount: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  validityDays: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plan', planSchema);