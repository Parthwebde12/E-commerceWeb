const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner_models");

// Owners log in separately from customers, so we use a different
// cookie name (owner_token) to avoid clashing with the user session.
module.exports = async function isOwnerLoggedIn(req, res, next) {
  const token = req.cookies.owner_token;
  if (!token) {
    return res.redirect("/owners/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const owner = await ownerModel.findOne({ email: decoded.email });
    if (!owner) {
      return res.redirect("/owners/login");
    }
    req.owner = owner;
    next();
  } catch (err) {
    res.clearCookie("owner_token");
    res.redirect("/owners/login");
  }
};
