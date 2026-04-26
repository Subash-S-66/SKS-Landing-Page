const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const routes = require('../src/routes');

const app = express();

// Database connection state
let isConnected;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

// Ensure DB is connected before handling requests in serverless environment
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(mongoSanitize());

// X-Internal-Token Protection Middleware (Proxy Guard)
const proxyGuard = (req, res, next) => {
  const token = req.headers['x-internal-token'];
  if (!token || token !== process.env.INTERNAL_API_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: Invalid internal token' });
  }
  next();
};

app.use(proxyGuard);

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// API Routes
app.use('/api', routes);

module.exports = app;
