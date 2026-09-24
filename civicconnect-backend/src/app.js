const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const errorHandler = require('./middleware/errorHandling');
app.use(express.json());



// Health check route — proves the server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


//temporary
const RequestRepository = require('./repositories/requestRepository');
const RequestService = require('./services/requestService');

const requestRepository = new RequestRepository();
const requestService = new RequestService(requestRepository);

app.get('/requests', async (req, res) => {
  const requests = await requestService.getAllRequests();
  res.status(200).json(requests);
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});