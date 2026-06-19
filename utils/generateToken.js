const jwt = require("jsonwebtoken");

// Signs a JWT for whatever payload you give it (e.g. { email, id })
module.exports = function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "7d" });
};
