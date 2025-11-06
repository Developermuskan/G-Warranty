// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

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
app.use('/api/users', verifyToken, userRoutes);

// ✅ Swagger UI setup
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
