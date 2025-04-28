const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
