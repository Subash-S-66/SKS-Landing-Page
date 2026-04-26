const Faq = require('../models/Faq');

const getFaqs = async (req, res) => {
  try {
    const filter = req.user ? {} : { visible: true }; // Admin sees all, public sees visible
    const faqs = await Faq.find(filter).sort('order');
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createFaq = async (req, res) => {
  try {
    const faq = new Faq(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getFaqs, createFaq, updateFaq, deleteFaq };
