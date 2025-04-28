// File: src/services/api.js (updated for your specific routes)
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/user/login", { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkChatRoom = async (user1Id, user2Id) => {
  try {
    const response = await api.get(
      `/room/check/?user1Id=${user1Id}&user2Id=${user2Id}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Room doesn't exist
    }
    throw error.response?.data || error.message;
  }
};

export const createChatRoom = async (user1Id, user2Id) => {
  try {
    const response = await api.post("/room/create", { user1Id, user2Id });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getChatMessages = async (roomId) => {
  try {
    const response = await api.get(`/room/messages/?roomId=${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
