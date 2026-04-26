const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  businessName: { type: String, required: true },
  avatarUrl: { type: String },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  quote: { type: String, required: true },
  visible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
