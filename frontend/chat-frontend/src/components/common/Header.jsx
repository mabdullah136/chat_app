import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container header-content">
        <h1>Chat App</h1>

        {user && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="user-info" style={{ marginRight: "20px" }}>
              {user.firstName} {user.lastName}
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{ fontSize: "14px", padding: "8px 12px" }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
