const Request = require('../models/request');

class RequestRepository {
  async findAll() {
    return Request.find({}).sort({ createdAt: -1 });
  }

  async create(data) {
    return Request.create(data);
  }
}

module.exports = RequestRepository;
