const mongoose = require("mongoose");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(ENV);

if (ENV === "production") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
} else {
  mongoose.connect(
    "mongodb+srv://dbuser:admin001@plant-app.8jgjf.mongodb.net/plant-app"
  );
}

module.exports = mongoose;
