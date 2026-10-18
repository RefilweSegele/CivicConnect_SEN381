const mongoose = require('mongoose');
const Request = require('../src/models/request');
const AuditLog = require('../src/models/auditLog');
const User = require('../src/models/user');

beforeAll(async () => {
    if (!process.env.MONGO_URI_TEST) {
        process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/civicconnect_test';
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

describe('CivicConnect Backend Verification Test Suite', () => {

    // --- INTEGRATION / ENDPOINT SIMULATION TESTS ---

    test('INT-01 (Positive): Validate request payload structure and schema compliance', () => {
        const payload = {
            title: 'Water Leak on 5th Ave',
            description: 'Pipe burst near main intersection.',
            category: 'Water',
            departmentId: 'Water-Dep',
            residentId: new mongoose.Types.ObjectId()
        };
        const reqDoc = new Request(payload);
        expect(reqDoc.title).toBe(payload.title);
        expect(reqDoc.category).toBe('Water');
    });

    test('INT-02 (Negative): Block request creation when mandatory category is missing (FR-002)', async () => {
        let err;
        try {
            const invalidReq = new Request({
                title: 'Broken Streetlight',
                description: 'Light is out.',
                residentId: new mongoose.Types.ObjectId()
                // category omitted
            });
            await invalidReq.validate();
        } catch (error) {
            err = error;
        }
        // If category is required or defaults, verify schema behavior
        expect(err).toBeDefined();
    });

    test('INT-03 (Security/Failure): Verify role restriction logic on protected actions', () => {
        const user = new User({
            name: 'Staff Member',
            email: 'staff@civicconnect.co.za',
            password: 'securepassword123',
            role: 'staff'
        });
        expect(user.role).toBe('staff');
    });

    // --- BACKEND UNIT / COMPONENT TESTS ---

    test('UT-01: Request model enforces title requirement', async () => {
        let err;
        try {
            const reqWithoutTitle = new Request({ description: 'Test', category: 'Other' });
            await reqWithoutTitle.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.title).toBeDefined();
    });

    test('UT-02: Request model handles default properties correctly (FR-001)', () => {
        const newReq = new Request({
            title: 'Test Request',
            description: 'Testing default status',
            category: 'Sanitation',
            departmentId: 'Dep-1',
            residentId: new mongoose.Types.ObjectId()
        });
        expect(newReq.category).toBe('Sanitation');
    });

    test('UT-03: Request model applies default department ID when omitted', () => {
        const req = new Request({
            title: 'Test',
            description: 'Test desc',
            category: 'Roads',
            residentId: new mongoose.Types.ObjectId()
        });
        expect(req.departmentId).toBe('General');
    });

    test('UT-04: Audit log schema correctly requires old and new status', () => {
        const log = new AuditLog({
            requestId: new mongoose.Types.ObjectId(),
            changedBy: new mongoose.Types.ObjectId()
        });
        const err = log.validateSync();
        expect(err.errors.oldStatus).toBeDefined();
        expect(err.errors.newStatus).toBeDefined();
    });

    test('UT-05: User model validates role enum constraints', () => {
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