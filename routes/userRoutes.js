const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const {
  registerUser,
  adminCreateUser,
  createShopkeeper,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/* ------------------  PUBLIC ROUTE (REGISTER)  ------------------ */
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user (role always set to 'user')
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
 *         201:
 *          description: User registered successfully
 *          content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User registered successfully
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Muskan Verma
 *                       email:
 *                         type: string
 *                         example: muskan@example.com
 *                       role:
 *                         type: string
 *                         example: user
 */
router.post("/register", registerUser);

/* ------------------  ADMIN-ONLY CREATE ROUTES  ------------------ */
/**
 * @swagger
 * /api/users/admin-create:
 *   post:
 *     summary: Admin-only — create user with any role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: shopkeeper
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: Admin User
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 */
router.post("/admin-create", verifyToken, authorizeRoles("admin"), adminCreateUser);

/**
 * @swagger
 * /api/users/create-shopkeeper:
 *   post:
 *     summary: Admin-only — create a new shopkeeper (role fixed as 'shopkeeper')
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 example: Shopkeeper One
 *               email:
 *                 type: string
 *                 example: shopkeeper1@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: shop123
 *     responses:
 *       201:
 *         description: Shopkeeper created successfully
 *       403:
 *         description: Forbidden — Only admin can create
 *       500:
 *         description: Server error
 */
router.post("/create-shopkeeper", verifyToken, authorizeRoles("admin"), createShopkeeper);

// ✅ Protect all routes below
router.use(verifyToken);

/* ------------------ CRUD ROUTES ------------------ */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", authorizeRoles("admin"), getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID (admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", authorizeRoles("admin"), getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *             example:
 *               name: Jane Doe
 *               email: jane@example.com
 *               role: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put("/:id", authorizeRoles("admin"), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numeric ID of the user to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authorizeRoles("admin"), deleteUser);


module.exports = router;
