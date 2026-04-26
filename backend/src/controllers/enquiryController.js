const Enquiry = require('../models/Enquiry');
const { sendEmail } = require('../utils/mailer');

const createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    // 1. Send notification to Admin
    const adminHtml = `
      <h3>New Enquiry Received</h3>
      <p><strong>Name:</strong> ${enquiry.name}</p>
      <p><strong>Email:</strong> ${enquiry.email}</p>
      <p><strong>Phone:</strong> ${enquiry.phone || 'N/A'}</p>
      <p><strong>Business Type:</strong> ${enquiry.businessType}</p>
      <p><strong>Service:</strong> ${enquiry.serviceInterestedIn}</p>
      <p><strong>Budget:</strong> ${enquiry.budgetRange}</p>
      <p><strong>Message:</strong> ${enquiry.message}</p>
    `;
    await sendEmail(process.env.ADMIN_EMAIL, 'New Enquiry - SKS Services', adminHtml).catch(e => console.error('Admin email failed', e));

    // 2. Send confirmation to Client
    const clientHtml = `
      <h3>Thank you for reaching out, ${enquiry.name}!</h3>
      <p>We have received your enquiry regarding <strong>${enquiry.serviceInterestedIn}</strong>.</p>
      <p>Here is a summary of what you submitted:</p>
      <blockquote>${enquiry.message}</blockquote>
      <p>Our team will get back to you within 24 hours.</p>
      <p>Best regards,<br>SKS Services</p>
    `;
    await sendEmail(enquiry.email, 'We received your enquiry - SKS Services', clientHtml).catch(e => console.error('Client email failed', e));

    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry };
