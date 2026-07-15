# BE-04 Notes Service

## Authentication flow

This service now supports user registration, login, and a protected notes route. Register with POST /register, log in with POST /login, and call GET /notes with a Bearer token to access the protected route.

### Example requests

```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"pass123"}'
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"pass123"}'
curl -X GET http://localhost:3000/notes -H "Authorization: Bearer <token>"
```

Passwords are hashed with bcryptjs and tokens are signed with JSON Web Tokens (JWT). The protected route returns 401 for missing/invalid credentials and 403 for tokens that do not map to a known user.
