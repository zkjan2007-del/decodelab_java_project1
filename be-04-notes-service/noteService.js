function createNoteService(repository) {
  let nextId = 1;

  return {
    createNote(content) {
      if (typeof content !== 'string' || content.trim() === '') {
        const error = new Error('Note content is required');
        error.statusCode = 400;
        throw error;
      }

      const note = {
        id: nextId++,
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      repository.create(note);
      return note;
    },

    listNotes() {
      return repository.findAll();
    },
  };
}

module.exports = {
  createNoteService,
};
