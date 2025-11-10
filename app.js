// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// ✅ Import DB connection
const pool = require('./db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Import Swagger
const { swaggerUi, swaggerSpec } = require('./swagger');

// ✅ Import JWT verify middleware
const verifyToken = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// ✅ Apply routes
// Auth routes (login/register) remain PUBLIC (no token needed)
app.use('/api/auth', authRoutes);

// ✅ All other routes PROTECTED with JWT verification
app.use('/api/users', userRoutes);

// ✅ Swagger UI setup
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);


//delete later
app.get('/api/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database(), current_user;');
    res.json({
      connected: true,
      database: result.rows[0].current_database,
      user: result.rows[0].current_user,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
