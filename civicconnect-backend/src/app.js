const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandling');
const { protect, authorize } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const RequestRepository = require('./repositories/requestRepository');
const RequestService = require('./services/requestService');

app.use(express.json());

// Set up static file serving for the frontend interface and ES modules
const FRONTEND = path.join(__dirname, '../../civicconnect-frontend');
app.use('/src', express.static(path.join(FRONTEND, 'src')));
app.use(express.static(path.join(FRONTEND, 'public')));

// Simple health check endpoint to verify server status
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount Authentication routes
app.use('/api/auth', authRoutes);

// Initialize database repositories and business logic services
const requestRepository = new RequestRepository();
const requestService = new RequestService(requestRepository);

// Utility wrapper to catch asynchronous route errors and pass them to Express error handlers
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

// REST API endpoints for service request lifecycle management
app.get('/api/requests', protect, wrap(async (req, res) => {
  res.status(200).json({ data: await requestService.getAllRequests() });
}));

app.post('/api/requests', protect, wrap(async (req, res) => {
  res.status(201).json(await requestService.createRequest({ ...req.body, residentId: req.user.id }));
}));

app.patch('/api/requests/:id/status', protect, authorize('staff', 'supervisor', 'admin'), wrap(async (req, res) => {
  res.status(200).json(await requestService.changeStatus(req.params.id, req.body.status));
}));

app.patch('/api/requests/:id', protect, wrap(async (req, res) => {
  res.status(200).json(await requestService.updateRequest(req.params.id, req.body));
}));

app.delete('/api/requests/:id', protect, wrap(async (req, res) => {
  await requestService.deleteRequest(req.params.id);
  res.status(200).json({ message: 'Request deleted.' });
}));

app.post('/api/requests/:id/notes', protect, wrap(async (req, res) => {
  res.status(201).json(await requestService.addNote(req.params.id, req.body.text));
}));

app.use(errorHandler);

// Connect to MongoDB first, then start server
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
} else {
  // Just connect for tests
  connectDB();
}