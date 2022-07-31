const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || "";

async function mongoConnect() {
  try {
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("Mongoose connection failed", error);
  }
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = { mongoConnect, mongoDisconnect };
