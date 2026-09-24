class RequestService {
  constructor(repository) {
    this.repository = repository; // injected, not hardcoded
  }

  async getAllRequests() {
    return this.repository.findAll();
  }

  async createRequest(data) {
    return this.repository.create(data);
  }
}

module.exports = RequestService;