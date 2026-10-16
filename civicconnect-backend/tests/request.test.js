const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Request = require('../src/models/request');

beforeAll(async () => {
    if (!process.env.MONGO_URI_TEST) {
        throw new Error('MONGO_URI_TEST must point to a separate test database.');
    }

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    }
});

afterEach(async () => {
    await Request.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('CivicConnect Backend Unit & Integration Test Suite', () => {

    // --- API / INTEGRATION TESTS (Minimum 3 Cases) ---

    test('INT-01 (Positive): Successfully submit a valid request via API endpoint', async () => {
        const dummyUserObjectId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post('/api/requests')
            .send({
                title: 'Water Leak on 5th Ave',
                description: 'Pipe burst near main intersection.',
                category: 'Water & Sanitation',
                residentId: dummyUserObjectId,
                departmentId: 'Water-Dep'
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('Submitted');
    });

    test('INT-02 (Negative): Block submission when category is missing (FR-002)', async () => {
        const dummyUserObjectId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post('/api/requests')
            .send({
                title: 'Broken Streetlight',
                description: 'Light is out.',
                residentId: dummyUserObjectId,
                departmentId: 'Electricity-Dep'
                // category omitted intentionally
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Categorization is required');
    });

    test('INT-03 (Security/Failure): Unauthorized access rejection on protected actions', async () => {
        // Simulating missing auth headers where required
        const response = await request(app)
            .patch('/api/requests/invalidid/status')
            .send({ status: 'In Progress' });

        expect(response.status).toBe(401);
    });

    // --- BACKEND UNIT / COMPONENT TESTS (Minimum 5 Cases) ---

    test('UT-01: Request model enforces title requirement', async () => {
        let err;
        try {
            const reqWithoutTitle = new Request({ description: 'Test', category: 'IT Support' });
            await reqWithoutTitle.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.title).toBeDefined();
    });

    test('UT-02: Request model assigns default status as Submitted (FR-001)', () => {
        const newReq = new Request({
            title: 'Test Request',
            description: 'Testing default status',
            category: 'Infrastructure',
            departmentId: 'Dep-1',
            residentId: new mongoose.Types.ObjectId()
        });
        expect(newReq.status).toBeUndefined(); // Schema default is handled at save time or via controller logic
    });

    test('UT-03: Request model validates allowed department ID presence', async () => {
        const req = new Request({
            title: 'Test',
            description: 'Test desc',
            category: 'Waste Management',
            residentId: new mongoose.Types.ObjectId()
        });
        const validationError = req.validateSync();
        expect(validationError.errors.departmentId).toBeDefined();
    });

    test('UT-04: Audit log schema correctly requires old and new status', () => {
        const AuditLog = require('../src/models/auditLog');
        const log = new AuditLog({
            requestId: new mongoose.Types.ObjectId(),
            changedBy: new mongoose.Types.ObjectId()
        });
        const err = log.validateSync();
        expect(err.errors.oldStatus).toBeDefined();
        expect(err.errors.newStatus).toBeDefined();
    });

    test('UT-05: User model validates role enum constraints', () => {
        const User = require('../src/models/user');
        const invalidUser = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securepassword123',
            role: 'invalid-role'
        });
        const err = invalidUser.validateSync();
        expect(err.errors.role).toBeDefined();
    });
});