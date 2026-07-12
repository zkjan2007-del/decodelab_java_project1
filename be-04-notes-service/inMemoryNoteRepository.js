class InMemoryNoteRepository {
  constructor() {
    this.notes = [];
  }

  create(note) {
    this.notes.push(note);
    return note;
  }

  findAll() {
    return this.notes.slice();
  }
}

module.exports = {
  InMemoryNoteRepository,
};
