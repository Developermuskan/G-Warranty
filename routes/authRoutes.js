// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { login, refreshToken } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */


/**
 * @swagger
 * /api/auth/user-dashboard:
 *   get:
 *     summary: Access User Dashboard (user or admin roles)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success message for user or admin
 *       403:
 *         description: Access denied
 */
router.get("/user-dashboard", verifyToken, authorizeRoles("user", "admin"), (req, res) => {
  res.json({ message: `Welcome ${req.user.role}! This is your dashboard.` });
});


/**
 * @swagger
 * /api/auth/admin-panel:
 *   get:
 *     summary: Access Admin Panel (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success message for admin
 *       403:
 *         description: Access denied
 */

router.get("/admin-panel", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You have full access." });
});


/**
 * @swagger
 * /api/auth/shopkeeper-zone:
 *   get:
 *     summary: Access Shopkeeper Zone (shopkeeper or admin roles)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success message for shopkeeper or admin
 *       403:
 *         description: Access denied
 */


router.get("/shopkeeper-zone", verifyToken, authorizeRoles("shopkeeper", "admin"), (req, res) => {
  res.json({ message: "Welcome Shopkeeper!" });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: muskan@example.com
 *               password:
 *                 type: string
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */



// ✅ USER DASHBOARDS — ROLE PROTECTED ROUTES

// 🧠 Login Route
router.post("/login", login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Generate a new access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The refresh token obtained from login
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Returns a new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: No token provided
 *       403:
 *         description: Invalid or expired refresh token
 */

// ♻️ Refresh Token Route
router.post("/refresh-token", refreshToken);

module.exports = router;
