const mongoose = require("mongoose");
const Room = require("../../models/room/room");

module.exports = {
  roomCheck: async (req, res) => {
    try {
      const { user1Id, user2Id } = req.query;
      if (!user1Id || !user2Id) {
        return res.status(400).json({ message: "User IDs are required" });
      }
      const room = await Room.findOne({
        $or: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      }).sort({ createdAt: -1 });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  newRoom: async (req, res) => {
    try {
      const { user1Id, user2Id } = req.body;

      const roomId = `${user1Id}_${user2Id}_${Date.now()}`;

      const room = new Room({
        roomId,
        user1Id,
        user2Id,
      });

      await room.save();
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  roomMessages: async (req, res) => {
    try {
      const { roomId } = req.query;

      const messages = await Room.find({ roomId }).sort({ createdAt: 1 });

      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
