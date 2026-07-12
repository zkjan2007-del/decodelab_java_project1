const { Pool } = require('pg');

class PostgresNoteRepository {
  constructor(connectionString = null) {
    const resolvedConnectionString = connectionString || buildConnectionString();
    this.pool = new Pool({ connectionString: resolvedConnectionString });
  }

  async create(note) {
    const result = await this.pool.query(
      'INSERT INTO notes (content, created_at) VALUES ($1, $2) RETURNING id, content, created_at',
      [note.content, note.created_at]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT id, content, created_at FROM notes ORDER BY id ASC');
    return result.rows;
  }
}

function buildConnectionString() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

module.exports = {
  PostgresNoteRepository,
};
