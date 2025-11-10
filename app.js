// app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swagger');
const pool = require('./config/postgresdb'); // DB connection

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ ROUTES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ✅ DB Check Route
app.get('/api/db-check', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT current_database(), current_user');
    res.json({
      connected: true,
      database: result.rows[0].current_database,
      user: result.rows[0].current_user,
      environment: process.env.NODE_ENV || 'development',
    });
    client.release();
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// ✅ Swagger Docs Route
const swaggerOptionsUI = {
  customCss: `
    .swagger-ui .topbar { display: none !important; }  /* Hides the header bar */
    .swagger-ui .info hgroup.main { margin-top: 0 !important; } /* Adjust spacing */
  `,
  customSiteTitle: "G-Warranty API Docs",
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptionsUI));


// ✅ Default Home Route
app.get('/', (req, res) => {
  res.send('🚀 G-Warranty API is running in MVC mode!');
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
