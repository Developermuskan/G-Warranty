// models/userModel.js
const pool = require('../config/postgresdb');

const UserModel = {
  async createUser(name, email, password, role = 'user') {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password, role]
    );
    return result.rows[0];
  },

  async getAllUsers() {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users ORDER BY id ASC'
    );
    return result.rows;
  },

  async getUserById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id=$1',
      [id]
    );
    return result.rows[0];
  },

  async getUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [
      email,
    ]);
    return result.rows[0];
  },

  async updateUser(id, name, email, password, role = 'user') {
    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2, password=$3, role=$4 WHERE id=$5 RETURNING id, name, email, role',
      [name, email, password, role, id]
    );
    return result.rows[0];
  },

  async deleteUser(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id=$1 RETURNING id, name, email, role',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = UserModel;
