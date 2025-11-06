const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const bcrypt = require("bcrypt");
const pool = require("../db");

console.log("authorizeRoles import:", authorizeRoles);
console.log("authorizeRoles('admin') type:", typeof authorizeRoles("admin"));


// Example routes
router.get(
  "/user-dashboard",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.role} to User Dashboard` });
  }
);

router.get(
  "/admin-dashboard",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

router.get(
  "/shop-dashboard",
  verifyToken,
  authorizeRoles("shopkeeper"),
  (req, res) => {
    res.json({ message: "Welcome Shopkeeper!" });
  }
);


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (password is hashed before saving)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Muskan Verma
 *               email:
 *                 type: string
 *                 example: muskan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (without passwords)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users (password hidden)
 *       400:
 *         description: Bad Request — The request parameters are invalid
 *       500:
 *         description: Internal Server Error — Something went wrong on the server
 */

// ✅ Apply token check to all below routes
router.use(verifyToken);


router.get('/', async (req, res) => {
  try {
    // Hide passwords
    const result = await pool.query('SELECT id, name, email FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID (without password)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details (without password)
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID (password re-hashed)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               password:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4 RETURNING id, name, email',
      [name, email, hashedPassword, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
