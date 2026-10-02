const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const errorHandler = require('./middleware/errorHandling');
const RequestRepository = require('./repositories/requestRepository');
const RequestService = require('./services/requestService');

app.use(express.json());

//Serve static frontend files for the public folder
app.use(express.static(path.join(__dirname, '../public')));

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
