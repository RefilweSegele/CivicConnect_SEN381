const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const requestRoutes = require('../routes/requestRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const errorHandler = require('./middleware/errorHandling');
const RequestRepository = require('./repositories/requestRepository');
const RequestService = require('./services/requestService');

const allowedOrigins = new Set([
  'http://127.0.0.1:5500',
  'http://localhost:5500'
]);

app.use((req, res, next) => {
  const origin = req.get('Origin');

  if (allowedOrigins.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use('/api/requests', requestRoutes); // Mount the request routes

//Serve static frontend files for the public folder
app.use(express.static(path.join(__dirname, '../../civicconnect-frontend/public')));

// Health check route — proves the server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
//Service and Repository Instatiation
const requestRepository = new RequestRepository();
const requestService = new RequestService(requestRepository);

// Requests API Endpoint
app.get('/requests', async (req, res, next) => {
  try {
    const requests = await requestService.getAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

module.exports = app;
