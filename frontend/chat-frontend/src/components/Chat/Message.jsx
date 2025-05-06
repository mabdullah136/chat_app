// src/components/Chat/Message.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

const Message = ({ message }) => {
  const { user } = useAuth();

  // Check if this message was sent by current user
  const isCurrentUser =
    typeof message.senderId === "object"
      ? message.senderId._id === user._id
      : message.senderId === user._id;

  // Get the message content
  const messageContent = message.message || "No message content";

  // Format timestamp
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`message-wrapper ${
        isCurrentUser ? "message-sent-wrapper" : "message-received-wrapper"
      }`}
    >
      {!isCurrentUser && (
        <div className="message-avatar">
          {message.senderId &&
          typeof message.senderId === "object" &&
          message.senderId.username
            ? message.senderId.username.charAt(0).toUpperCase()
            : "U"}
        </div>
      )}
      <div
        className={`message ${
          isCurrentUser ? "message-sent" : "message-received"
        }`}
      >
        <div className="message-content">{messageContent}</div>
        <div className="message-timestamp">{timestamp}</div>
      </div>
      {isCurrentUser && <div className="message-tick">✓</div>}
    </div>
  );
};

export default Message;
