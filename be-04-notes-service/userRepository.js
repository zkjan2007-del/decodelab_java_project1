class InMemoryUserRepository {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  create(user) {
    user.id = this.nextId++;
    this.users.push(user);
    return user;
  }

  findByUsername(username) {
    return this.users.find((u) => u.username === username) || null;
  }

  findById(id) {
    return this.users.find((u) => u.id === id) || null;
  }
}

module.exports = {
  InMemoryUserRepository,
};
