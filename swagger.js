// swagger.js
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "A simple CRUD API using Node.js, Express, and PostgreSQL",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server",
      },
      {
        url: "https://facultative-melita-sonorous.ngrok-free.dev",
        description: "Ngrok Tunnel (Live Server)",
      },
      {
        url: "https://g-warranty.onrender.com",
        description: "Render Live Server",
      },
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = { swaggerUi, swaggerSpec };
