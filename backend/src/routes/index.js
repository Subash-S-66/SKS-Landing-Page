const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { loginLimiter, publicLimiter } = require('../middleware/rateLimit');

const { login, verifyToken } = require('../controllers/authController');
const { updatePassword } = require('../controllers/adminController');
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { getSettings, updateSettings } = require('../controllers/settingController');

// Auth routes
router.post('/admin/login', loginLimiter, login);
router.get('/admin/verify', authMiddleware, verifyToken);

// Public Routes (rate limited)
router.get('/services', publicLimiter, getServices);
router.get('/projects', publicLimiter, getProjects);
router.get('/testimonials', publicLimiter, getTestimonials);
router.get('/settings', publicLimiter, getSettings);
router.post('/enquiries', publicLimiter, createEnquiry);

// Protected Admin Routes
router.use('/admin', authMiddleware);

router.post('/admin/services', createService);
router.put('/admin/services/:id', updateService);
router.delete('/admin/services/:id', deleteService);

router.post('/admin/projects', createProject);
router.put('/admin/projects/:id', updateProject);
router.delete('/admin/projects/:id', deleteProject);

router.post('/admin/testimonials', createTestimonial);
router.put('/admin/testimonials/:id', updateTestimonial);
router.delete('/admin/testimonials/:id', deleteTestimonial);

router.get('/admin/enquiries', getEnquiries);
router.patch('/admin/enquiries/:id', updateEnquiryStatus);
router.delete('/admin/enquiries/:id', deleteEnquiry);

router.put('/admin/settings', updateSettings);
router.put('/admin/password', updatePassword);

// We need an endpoint for cloudinary uploads
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/admin/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload buffer to cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'sks-services'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
