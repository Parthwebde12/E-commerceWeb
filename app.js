require("dotenv").config({ path: [".env.local", ".env"] });
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

const { connectDatabase } = require("./config/mongoose-connection");

const currentUser = require("./middlewares/currentUser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/usersRouter");
const ownersRouter = require("./routes/ownersRouter");
const cartRouter = require("./routes/cartRouter");
const ordersRouter = require("./routes/ordersRouter");
const wishlistRouter = require("./routes/wishlistRouter");

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/health", function (req, res) {
  const isDatabaseReady = mongoose.connection.readyState === 1;
  res.status(isDatabaseReady ? 200 : 503).json({
    status: isDatabaseReady ? "ok" : "unavailable",
  });
});

// Attach res.locals.user on every request (used by the navbar)
app.use(currentUser);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/owners", ownersRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/wishlist", wishlistRouter);

app.use(function (req, res) {
  res.status(404).send("Not found");
});

app.use(function (err, req, res, next) {
  console.error(err);
  const status = Number.isInteger(err.status) ? err.status : 500;
  res
    .status(status)
    .send(
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message
    );
});

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be configured before starting the app.");
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.JWT_KEY.length < 32
  ) {
    throw new Error("JWT_KEY must be at least 32 characters in production.");
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  await connectDatabase();

  const server = app.listen(port, "0.0.0.0", function () {
    console.log(`Scatch listening on port ${port}`);
  });

  for (const signal of ["SIGTERM", "SIGINT"]) {
    process.once(signal, function () {
      console.log(`${signal} received; shutting down`);
      server.close(async function (err) {
        if (err) {
          console.error("HTTP server shutdown failed:", err);
          process.exitCode = 1;
        }

        try {
          await mongoose.disconnect();
        } catch (disconnectError) {
          console.error("MongoDB shutdown failed:", disconnectError);
          process.exitCode = 1;
        }
      });
    });
  }
}

if (require.main === module) {
  start().catch(function (err) {
    console.error("Application startup failed:", err);
    process.exitCode = 1;
  });
}

module.exports = app;
