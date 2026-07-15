const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function createAuthService(userRepository) {
  const secret = process.env.JWT_SECRET || 'change-me';
  const tokenExpiry = '1h';

  return {
    register(username, password) {
      if (!username || !password) {
        const err = new Error('Username and password are required');
        err.statusCode = 400;
        throw err;
      }

      const existing = userRepository.findByUsername(username);
      if (existing) {
        const err = new Error('Username already taken');
        err.statusCode = 409;
        throw err;
      }

      const hash = bcrypt.hashSync(password, 10);
      const user = userRepository.create({ username, passwordHash: hash });
      const token = jwt.sign({ userId: user.id, username: user.username }, secret, { expiresIn: tokenExpiry });
      return { user: { id: user.id, username: user.username }, token };
    },

    authenticate(username, password) {
      if (!username || !password) {
        const err = new Error('Username and password are required');
        err.statusCode = 400;
        throw err;
      }

      const user = userRepository.findByUsername(username);
      if (!user) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
      }

      const ok = bcrypt.compareSync(password, user.passwordHash);
      if (!ok) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, secret, { expiresIn: tokenExpiry });
      return { user: { id: user.id, username: user.username }, token };
    },

    verifyTokenFromReq(req) {
      const auth = req.headers && (req.headers.authorization || req.headers.Authorization);
      if (!auth) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      const parts = auth.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      const token = parts[1];
      try {
        const decoded = jwt.verify(token, secret);
        const user = userRepository.findById(decoded.userId);
        if (!user) {
          const err = new Error('Forbidden');
          err.statusCode = 403;
          throw err;
        }
        return decoded;
      } catch (err) {
        if (err.statusCode) {
          throw err;
        }

        const forbidden = new Error('Forbidden');
        forbidden.statusCode = 403;
        throw forbidden;
      }
    },
  };
}

module.exports = {
  createAuthService,
};
