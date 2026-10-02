class RequestRepository {
  async findAll() {
    // Member 2 needs to replace this with a real database query
    return [];
  }

  async create(data) {
    // Member 2 needs to replace this with a real database query
    return { id: Date.now(), ...data };
  }
}

module.exports = RequestRepository;