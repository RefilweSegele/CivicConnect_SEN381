const RequestRepository = require('../src/repositories/requestRepository');
const requestRepo = new RequestRepository();

// @desc    Get all requests (Supports filtering/viewing per FR-003 & FR-004)
async function getRequests(req, res, next) {
    try {
        const requests = await requestRepo.findAll();
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        next(error);
    }
}

// @desc    Create a new service request (Enforces FR-001 & FR-002: mandatory category & 'Submitted' status)
async function createRequest(req, res, next) {
    try {
        const { title, description, category, residentId, departmentId } = req.body;

        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ success: false, message: 'Request title is required.' });
        }
        if (typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({ success: false, message: 'Request description is required.' });
        }
        if (typeof category !== 'string' || !category.trim()) {
            return res.status(400).json({ success: false, message: 'Categorization is required (FR-002).' });
        }

        const requestData = {
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            status: 'Submitted', // FR-001 default status
            residentId: residentId || req.user?._id, // Fallback or authenticated user ID
            departmentId: departmentId || 'General-Dep'
        };

        const newRequest = await requestRepo.create(requestData);
        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getRequests,
    createRequest
};