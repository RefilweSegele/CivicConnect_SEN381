/**
 * Frontend Black-Box & Validation Tests ( For Milestone 3 part )
 */

// Simple assertion helper for client-side test execution
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion Failed: ${message}`);
    }
}

// Mock Request Validation Logic matching RequestFactory / form rules
function validateRequestPayload(data) {
    if (!data.title || data.title.trim().length < 3 || data.title.trim().length > 100) {
        return { valid: false, error: 'Title must be between 3 and 100 characters.' };
    }
    const validCategories = ['Infrastructure', 'Water & Sanitation', 'Electricity', 'Waste Management', 'IT Support'];
    if (!validCategories.includes(data.category)) {
        return { valid: false, error: 'Invalid category selected.' };
    }
    if (!data.description || data.description.trim().length < 10) {
        return { valid: false, error: 'Description must be at least 10 characters long.' };
    }
    return { valid: true };
}

// --- Test Suite Execution ---
console.log('Running Frontend Black-Box & Validation Tests...');

// BB-01: Boundary Value Analysis - Title Length (Min boundary = 3)
const testTitleTooShort = validateRequestPayload({ title: 'Hi', category: 'Infrastructure', description: 'Burst water pipe reported on 5th Ave.' });
assert(testTitleTooShort.valid === false, 'BB-01b: Title length < 3 must fail validation');

const testTitleValid = validateRequestPayload({ title: 'Burst pipe', category: 'Water & Sanitation', description: 'Major leak on main municipal road.' });
assert(testTitleValid.valid === true, 'BB-01a: Valid title length must pass validation');

// BB-02: Equivalence Partitioning - Category Selection
const testInvalidCategory = validateRequestPayload({ title: 'Broken Light', category: 'SpaceTravel', description: 'Streetlight is completely broken.' });
assert(testInvalidCategory.valid === false, 'BB-02: Invalid category must be rejected');

const testValidCategory = validateRequestPayload = validateRequestPayload({ title: 'Broken Light', category: 'Electricity', description: 'Streetlight is completely broken.' });
assert(testValidCategory.valid === true, 'BB-02b: Valid category must be accepted');

console.log('All Member 3 Frontend Black-Box Tests Passed Successfully!');
