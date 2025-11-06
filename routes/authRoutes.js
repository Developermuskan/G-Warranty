// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/tokenService");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // include role when generating tokens and sending response
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // 👈 added line
    },
  });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

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
router.post("/refresh-token", (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded);
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

module.exports = router;
