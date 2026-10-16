/**
 * Factory Method Pattern for Service Request Payloads
 * Enforces FR-001 & FR-002 validation rules prior to sending to the API.
 */
export class RequestFactory {
    static createRequest(title, category, description) {
        if (!title || !title.trim()) {
            throw new Error("Request title is required.");
        }
        if (!category || !category.trim()) {
            throw new Error("Categorization is required (FR-002).");
        }
        if (!description || !description.trim()) {
            throw new Error("Request description is required.");
        }

        return {
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            submittedAt: new Date().toISOString()
        };
    }
}
