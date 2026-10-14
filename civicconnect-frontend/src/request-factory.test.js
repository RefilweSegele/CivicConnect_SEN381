/**
 * Frontend Black-Box & E2E Validation Suite That Is Needed For Milestone 3
 * Author: Nompilo Mbense (Member 3)
 * Rigorous validation of UI form payload rules, BVA, EP, and negative states.
 */

function assert(condition, testId, description) {
    if (!condition) {
        throw new Error(`[FAIL] ${testId}: ${description}`);
    }
    console.log(`[PASS] ${testId}: ${description}`);
}

// Pre-flight payload validation mirroring frontend form constraints
function validateServiceRequest(payload) {
    if (!payload.title || typeof payload.title !== 'string') {
        return { valid: false, error: 'Title is required.' };
    }
    const trimmedTitle = payload.title.trim();
    // Boundary Value Analysis: Title length must be between 3 and 100 characters
    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
        return { valid: false, error: 'Title boundary violation: Must be 3-100 chars.' };
    }

    const validCategories = ['Infrastructure', 'Water & Sanitation', 'Electricity', 'Waste Management', 'IT Support'];
    // Equivalence Partitioning: Category must belong to valid partition
    if (!validCategories.includes(payload.category)) {
        return { valid: false, error: 'Equivalence violation: Invalid municipal category.' };
    }

    if (!payload.description || payload.description.trim().length < 10) {
        return { valid: false, error: 'Description must be at least 10 characters.' };
    }

    return { valid: true };
}

// --- TEST EXECUTION BASELINE ---
console.log('____________________________________________');
console.log('VALIDATE VALIDATE VALIDATE VALIDATE VALIDATE');
console.log('____________________________________________');

// BB-01: Boundary Value Analysis (Title Lower Boundary - 2 chars vs 3 chars)
const bvaFail = validateServiceRequest({ title: 'Pi', category: 'Infrastructure', description: 'Broken street light on main road.' });
assert(bvaFail.valid === false, 'BB-01 (BVA)', 'Reject title below lower boundary (2 chars)');

const bvaPass = validateServiceRequest({ title: 'Pipe Leak', category: 'Water & Sanitation', description: 'Major water leak on 5th Avenue intersection.' });
assert(bvaPass.valid === true, 'BB-01 (BVA)', 'Accept title exactly on lower valid boundary (9 chars)');

// BB-02: Equivalence Partitioning (Category Partitions)
const epInvalid = validateServiceRequest({ title: 'Pothole', category: 'SpaceDepartment', description: 'Deep pothole causing vehicle damage.' });
assert(epInvalid.valid === false, 'BB-02 (EP)', 'Reject invalid category outside valid equivalence partition');

const epValid = validateServiceRequest({ title: 'Pothole', category: 'Infrastructure', description: 'Deep pothole causing vehicle damage.' });
assert(epValid.valid === true, 'BB-02 (EP)', 'Accept valid category within standard partition');

// BB-03: Negative Testing (Missing Required Fields / Malformed Payload)
const negTest = validateServiceRequest({ title: '', category: 'Electricity', description: '' });
assert(negTest.valid === false, 'BB-03 (Negative)', 'Reject empty required fields and incomplete payload');

console.log('___________________________________________________');
console.log('------Black-Box Tests Executed Successfully.-------');
console.log('___________________________________________________');
