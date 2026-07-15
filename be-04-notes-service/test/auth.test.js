const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('events');

const { createNoteService } = require('../noteService');
const { InMemoryNoteRepository } = require('../inMemoryNoteRepository');
const { InMemoryUserRepository } = require('../userRepository');
const { createAuthService } = require('../authService');
const { createRoutes } = require('../routes');

class MockReq extends EventEmitter {
  constructor(method, url, headers = {}) {
    super();
    this.method = method;
    this.url = url;
    this.headers = headers;
  }
}

class MockRes {
  constructor() {
    this.statusCode = null;
    this.headers = {};
    this.body = '';
  }

  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    this.headers = headers;
  }

  end(payload) {
    this.body = payload || '';
  }
}

function createHarness() {
  const noteRepository = new InMemoryNoteRepository();
  const userRepository = new InMemoryUserRepository();
  const noteService = createNoteService(noteRepository);
  const authService = createAuthService(userRepository);
  const routes = createRoutes(noteService, authService);

  return { routes, authService, userRepository };
}

function sendRequest(routes, method, url, body, headers = {}) {
  const req = new MockReq(method, url, headers);
  const res = new MockRes();

  routes(req, res);

  if (body !== undefined) {
    req.emit('data', JSON.stringify(body));
    req.emit('end');
  }

  return res;
}

test('register hashes the password and returns a token', () => {
  const { routes, userRepository } = createHarness();

  const res = sendRequest(routes, 'POST', '/register', { username: 'alice', password: 's3cr3t' });

  assert.equal(res.statusCode, 201);
  const payload = JSON.parse(res.body);
  assert.equal(payload.user.username, 'alice');
  assert.ok(payload.token);

  const stored = userRepository.findByUsername('alice');
  assert.ok(stored);
  assert.notEqual(stored.passwordHash, 's3cr3t');
  assert.match(stored.passwordHash, /^\$2[aby]\$/);
});

test('GET /notes rejects requests without a token', () => {
  const { routes } = createHarness();

  const res = sendRequest(routes, 'GET', '/notes');

  assert.equal(res.statusCode, 401);
  assert.match(res.body, /Unauthorized/);
});

test('GET /notes returns 403 for a token that does not map to a known user', () => {
  const { routes } = createHarness();
  const token = 'invalid-token';

  const res = sendRequest(routes, 'GET', '/notes', undefined, { authorization: `Bearer ${token}` });

  assert.equal(res.statusCode, 403);
  assert.match(res.body, /Forbidden/);
});
