const express = require('express');
const router = express.Router();
const { getRequests, createRequest } = require('../controllers/requestController');

router.route('/')
    .get(getRequests)
    .post(createRequest);

// Status update mock endpoint for testing integration
router.patch('/:id/status', (req, res) => {
    // Protected route stub for testing 401/status updates
    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    res.status(200).json({ success: true, message: 'Status updated' });
});

module.exports = router;