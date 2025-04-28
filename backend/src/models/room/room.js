// const mongoose = require("mongoose");

// const roomSchema = new mongoose.Schema(
//   {
//     roomId: { type: String, required: true },
//     user1Id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     user2Id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     message: { type: String, required: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Room", roomSchema);

// backend/src/models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    user1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
