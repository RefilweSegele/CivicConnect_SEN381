const CATEGORIES = ['Sanitation', 'Roads', 'Electricity', 'Water', 'Other'];
const NEXT = { 'Submitted': 'In Progress', 'In Progress': 'Resolved', 'Resolved': 'Closed' };

const fail = (message, status = 400) => Object.assign(new Error(message), { status });

class RequestService {
  constructor(repository) {
    this.repository = repository;
  }

  validate(data = {}) {
    const title = String(data.title || '').trim();
    const category = String(data.category || '').trim();
    const description = String(data.description || '').trim();
    if (title.length < 3 || title.length > 100) throw fail('Title must be 3-100 characters.');
    if (!CATEGORIES.includes(category)) throw fail('A valid category is required.');
    if (!description) throw fail('Description is required.');
    if (description.length > 1000) throw fail('Description must be 1000 characters or fewer.');
    return { title, category, description };
  }

  async getOrFail(id) {
    const r = await this.repository.findById(id);
    if (!r) throw fail('Request not found.', 404);
    return r;
  }

  async getAllRequests() {
    return this.repository.findAll();
  }

  async createRequest(data) {
    const validated = this.validate(data);
    return this.repository.create({
      ...validated,
      residentId: data.residentId || null,
      departmentId: data.departmentId || 'General',
      status: 'Submitted',
      owner: null,
      notes: [],
      createdAt: new Date().toISOString()
    });
  }

  async updateRequest(id, data) {
    const r = await this.getOrFail(id);
    if (r.status !== 'Submitted') throw fail('Only Submitted requests can be edited.', 409);
    return this.repository.update(id, this.validate(data));
  }

  async deleteRequest(id) {
    const r = await this.getOrFail(id);
    if (r.status !== 'Submitted') throw fail('Only Submitted requests can be deleted.', 409);
    return this.repository.delete(id);
  }

  async changeStatus(id, status) {
    const r = await this.getOrFail(id);
    if (NEXT[r.status] !== status) throw fail(`Cannot move a request from ${r.status} to ${status}.`, 409);
    const patch = { status };
    if (status === 'In Progress') patch.owner = 'Staff';
    return this.repository.update(id, patch);
  }

  async addNote(id, text) {
    const r = await this.getOrFail(id);
    text = String(text || '').trim();
    if (!text) throw fail('Note text is required.');
    return this.repository.update(id, { notes: [...r.notes, { at: new Date().toISOString(), text }] });
  }
}

module.exports = RequestService;