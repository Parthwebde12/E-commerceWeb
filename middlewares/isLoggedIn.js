// Must run AFTER currentUser middleware (relies on res.locals.user).
// Blocks the request if no user is logged in.
module.exports = function isLoggedIn(req, res, next) {
  if (!res.locals.user) {
    return res.redirect("/users/login");
  }
  req.user = res.locals.user;
  next();
};
