const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  businessType: { type: String, required: true },
  serviceInterestedIn: { type: String, required: true },
  budgetRange: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Replied', 'Closed'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
