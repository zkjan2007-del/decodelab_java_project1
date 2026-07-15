function createRoutes(noteService, authService) {
  return (req, res) => {
    if (req.method === 'POST' && req.url === '/register') {
      readJsonBody(req, (error, body) => {
        if (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        try {
          const result = authService.register(body && body.username, body && body.password);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/login') {
      readJsonBody(req, (error, body) => {
        if (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        try {
          const result = authService.authenticate(body && body.username, body && body.password);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/notes') {
      readJsonBody(req, (error, body) => {
        if (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        try {
          const note = noteService.createNote(body && body.content);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(note));
        } catch (err) {
          res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/notes') {
      try {
        authService.verifyTokenFromReq(req);
      } catch (err) {
        res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }

      const notes = noteService.listNotes();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notes));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  };
}

function readJsonBody(req, callback) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    if (!body) {
      callback(null, {});
      return;
    }

    try {
      callback(null, JSON.parse(body));
    } catch (err) {
      callback(err);
    }
  });

  req.on('error', callback);
}

module.exports = {
  createRoutes,
};
