const jwt = require("jsonwebtoken");
const userModel = require("../models/user-models");

// Runs on every request. Never blocks the request — just attaches
// res.locals.user if a valid token cookie exists, so any EJS view
// can check `user` without each route having to fetch it manually.
module.exports = async function currentUser(req, res, next) {
  res.locals.user = null;

  const token = req.cookies.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email });
    res.locals.user = user || null;
  } catch (err) {
    res.locals.user = null;
  }

  next();
};
