require('dotenv').config();

const http = require('http');
const { createRoutes } = require('./routes');
const { createNoteService } = require('./noteService');
const { InMemoryNoteRepository } = require('./inMemoryNoteRepository');
const { InMemoryUserRepository } = require('./userRepository');
const { createAuthService } = require('./authService');

const repository = new InMemoryNoteRepository();
const noteService = createNoteService(repository);

const userRepository = new InMemoryUserRepository();
const authService = createAuthService(userRepository);

const routes = createRoutes(noteService, authService);

const server = http.createServer((req, res) => {
  routes(req, res);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Notes service running on port ${PORT}`);
});
