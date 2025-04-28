// File: src/components/Chat/Message.jsx (updated to handle your message format)
import React from "react";
import { useAuth } from "../../context/AuthContext";

const Message = ({ message }) => {
  const { user } = useAuth();
  // Check if this message was sent by current user
  const isCurrentUser = message.senderId === user._id;

  // Get the message content - adapting to your data structure
  const messageContent = message.message || "No message content";

  return (
    <div
      className={`message ${
        isCurrentUser ? "message-sent" : "message-received"
      }`}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>{messageContent}</div>
      <div
        style={{
          fontSize: "0.7rem",
          opacity: 0.7,
          alignSelf: isCurrentUser ? "flex-end" : "flex-start",
          marginTop: "4px",
        }}
      >
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;
