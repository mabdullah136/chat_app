// File: src/services/socket.js (updated for your socket implementation)
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://127.0.0.1:3000";

let socket;

export const initiateSocket = () => {
  socket = io(SOCKET_URL);
  console.log("Connecting to socket...");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const joinRoom = (roomId) => {
  if (socket) socket.emit("joinRoom", { roomId });
};

export const sendMessage = (roomId, user1Id, user2Id, senderId, message) => {
  if (socket) {
    socket.emit("sendMessage", { roomId, user1Id, user2Id, senderId, message });
  }
};

export const subscribeToMessages = (callback) => {
  if (socket) {
    socket.on("receiveMessage", (message) => {
      callback(message);
    });
  }
};

export const getSocket = () => socket;
