export const CATEGORIES = ['Sanitation', 'Roads', 'Electricity', 'Water', 'Other'];

export class RequestFactory {
    static createRequest(title, category, description) {
        // Clean up any extra whitespace from the input
        title = (title || '').trim();
        category = (category || '').trim();
        description = (description || '').trim();

        // Make sure the title exists and fits within our length boundaries
        if (!title) throw new Error('Request title is required.');
        if (title.length < 3 || title.length > 100) throw new Error('Title must be 3-100 characters.');
        
        // Ensure a valid category has been chosen
        if (!category) throw new Error('Categorization is required (FR-002).');
        if (!CATEGORIES.includes(category)) throw new Error('Please choose a valid category.');
        
        // Validate that the description is provided and not too long
        if (!description) throw new Error('Request description is required.');
        if (description.length > 1000) throw new Error('Description must be 1000 characters or fewer.');

        // Return the clean payload object with a timestamp attached
        return { title, category, description, submittedAt: new Date().toISOString() };
    }
}