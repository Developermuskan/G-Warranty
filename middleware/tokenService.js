// middleware/tokenService.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, // 👈 include role here
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, // 👈 include role here too
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
