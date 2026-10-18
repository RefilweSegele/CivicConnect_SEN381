// src/repositories/requestRepository.js
const Request = require('../models/request');

class RequestRepository {
  async findAll() {
    return await Request.find().lean();
  }

  async findById(id) {
    return await Request.findById(id).lean();
  }

  async create(data) {
    const record = new Request(data);
    const saved = await record.save();
    return saved.toObject();
  }

  async update(id, patch) {
    const updated = await Request.findByIdAndUpdate(id, patch, { new: true }).lean();
    return updated;
  }

  async delete(id) {
    const result = await Request.findByIdAndDelete(id);
    return result !== null;
  }
}

module.exports = RequestRepository;