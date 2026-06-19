require("dotenv").config();
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");

require("./config/mongoose-connection");

const currentUser = require("./middlewares/currentUser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/usersRouter");
const ownersRouter = require("./routes/ownersRouter");
const cartRouter = require("./routes/cartRouter");
const ordersRouter = require("./routes/ordersRouter");
const wishlistRouter = require("./routes/wishlistRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Attach res.locals.user on every request (used by the navbar)
app.use(currentUser);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/owners", ownersRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/wishlist", wishlistRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Scatch running on http://localhost:${PORT}`);
});
