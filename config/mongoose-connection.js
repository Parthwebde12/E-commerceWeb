const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri =
    process.env.MONGO_URI ||
    (process.env.NODE_ENV === "production"
      ? null
      : "mongodb://127.0.0.1:27017/scatch");

  if (!mongoUri) {
    throw new Error("MONGO_URI must be configured in production.");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}

module.exports = { connectDatabase, connection: mongoose.connection };