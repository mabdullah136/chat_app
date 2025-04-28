// backend/src/socket/socket.js
const Room = require("../models/room/room");
const Message = require("../models/messages/message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join Room
    socket.on("joinRoom", async ({ roomId }) => {
      try {
        console.log("Joining room:", roomId);
        // Verify room exists
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit("error", { message: "Room does not exist" });
          return;
        }

        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Fetch and emit message history
        const messages = await Message.find({ roomId })
          .sort({ createdAt: 1 })
          .lean();
        socket.emit(
          "messageHistory",
          messages.map((msg) => ({
            senderId: msg.senderId,
            message: msg.message,
            createdAt: msg.createdAt,
          }))
        );
      } catch (err) {
        console.error("Error joining room:", err);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Send Message
    socket.on(
      "sendMessage",
      async ({ roomId, user1Id, user2Id, senderId, message }) => {
        try {
          // Validate input
          if (!roomId || !senderId || !message) {
            socket.emit("error", { message: "Invalid message data" });
            return;
          }

          // Save message to database
          const newMessage = new Message({
            roomId,
            senderId,
            message,
          });
          await newMessage.save();

          // Broadcast message to the room
          io.to(roomId).emit("receiveMessage", {
            senderId,
            message,
            createdAt: newMessage.createdAt,
          });
        } catch (err) {
          console.error("Error sending message:", err);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
