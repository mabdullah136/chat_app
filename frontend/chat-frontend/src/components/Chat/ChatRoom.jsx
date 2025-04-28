// frontend/src/components/ChatRoom.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message";
import {
  getAllUsers,
  checkChatRoom,
  createChatRoom,
  getChatMessages,
} from "../../services/api";
import {
  initiateSocket,
  disconnectSocket,
  joinRoom,
  sendMessage,
  subscribeToMessages,
} from "../../services/socket";

const ChatRoom = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState("");
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Find other user's information
  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const users = await getAllUsers();
        const foundUser = users.find((u) => u._id === userId);
        if (foundUser) {
          setOtherUser(foundUser);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to fetch user information");
        console.error("Error fetching user:", err);
      }
    };

    if (userId) {
      fetchOtherUser();
    }
  }, [userId]);

  // Set up the room and socket
  useEffect(() => {
    const setupRoom = async () => {
      try {
        if (!user || !userId) return;

        // Check if room exists
        let existingRoom = await checkChatRoom(user._id, userId);

        if (!existingRoom) {
          // Create new room
          existingRoom = await createChatRoom(user._id, userId);
        }

        setRoom(existingRoom);
        setRoomId(existingRoom.roomId);

        // Get messages for this room
        const messagesData = await getChatMessages(existingRoom.roomId);
        setMessages(messagesData);

        // Connect to socket
        const socket = initiateSocket();
        joinRoom(existingRoom.roomId);

        // Subscribe to incoming messages and history
        subscribeToMessages((data) => {
          if (data.type === "history") {
            setMessages(data.messages);
          } else {
            const newMsg = {
              senderId: data.senderId,
              message: data.message,
              createdAt: data.createdAt || new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, newMsg]);
          }
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to setup chat room");
        console.error("Error setting up chat room:", err);
        setLoading(false);
      }
    };

    setupRoom();

    return () => {
      disconnectSocket();
    };
  }, [user, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !roomId) return;

    // Send message via socket
    sendMessage(roomId, room.user1Id, room.user2Id, user._id, newMessage);

    // Clear input
    setNewMessage("");
  };

  const handleBack = () => {
    navigate("/users");
  };

  if (loading) {
    return <div className="container">Setting up chat room...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
        <button className="btn" onClick={handleBack}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button className="btn btn-secondary" onClick={handleBack}>
          Back to Users
        </button>
        {otherUser && (
          <div>
            <h2>
              Chat with {otherUser.firstName} {otherUser.lastName}
            </h2>
          </div>
        )}
      </div>

      <div className="chat-container">
        <div className="chat-content">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#6c757d",
                  padding: "20px",
                }}
              >
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, index) => (
                <Message key={index} message={msg} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" className="btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
