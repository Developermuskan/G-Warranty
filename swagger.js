// swagger.js
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description:
        "API documentation for **G-Warranty** — a role-based access and warranty management system built with Node.js, Express, and PostgreSQL.",
      contact: {
        name: "G-Warranty Developer Team",
        email: "support@gwarranty.com",
      },
    },
    servers: [
      { url: "http://localhost:3000", description: "Local Server" },
      { url: "https://facultative-melita-sonorous.ngrok-free.dev", description: "Ngrok Tunnel (Live Server)" },
      { url: "https://g-warranty.onrender.com", description: "Render Production Server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ✅ Export properly
module.exports = { swaggerUi, swaggerSpec };
