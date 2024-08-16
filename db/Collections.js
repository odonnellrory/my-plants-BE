const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://dbuser:admin001@plant-app.8jgjf.mongodb.net/My-plant-app"
);

module.exports = mongoose;
