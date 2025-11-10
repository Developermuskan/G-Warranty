// controllers/userController.js
const UserResource = require('../resources/userResource');
const pool = require('../config/postgresdb');
const bcrypt = require('bcrypt');

// 🧠 Register (Public)
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'user') RETURNING *",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully', user: UserResource.single(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// 👑 Admin — Create User with any Role
exports.adminCreateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'User created successfully', user: UserResource.single(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// 🏪 Admin — Create Shopkeeper
exports.createShopkeeper = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'shopkeeper') RETURNING *",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'Shopkeeper created successfully', user: UserResource.single(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ message: 'Error creating shopkeeper', error: err.message });
  }
};

// 📋 Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users");
    res.status(200).json(UserResource.collection(result.rows));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// 🔍 Get User by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(UserResource.single(result.rows[0]));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

// ✏️ Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *",
      [name, email, role, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully', user: UserResource.single(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// ❌ Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully', user: UserResource.single(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
