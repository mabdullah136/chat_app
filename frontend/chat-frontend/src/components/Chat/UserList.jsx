import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        // Filter out the current user
        const filteredUsers = usersData.filter((u) => u._id !== user._id);
        setUsers(filteredUsers);
      } catch (err) {
        setError("Failed to load users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user._id]);

  const handleUserClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return <div className="container">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Choose a user to chat with</h2>

      <div className="user-list">
        {users.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No other users found.
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="user-list-item"
              onClick={() => handleUserClick(u._id)}
            >
              <h3>
                {u.firstName} {u.lastName}
              </h3>
              <p style={{ color: "#6c757d" }}>@{u.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
