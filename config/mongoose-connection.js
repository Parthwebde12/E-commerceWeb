const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scatch")
  .then(function () {
    console.log("connected to MongoDB");
  })
  .catch(function (err) {
    console.log(err);
  });


 module.exports = mongoose.connection; 