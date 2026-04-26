const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  success: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

// TTL index to automatically delete attempts older than 30 days
loginAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('LoginAttempt', loginAttemptSchema);
