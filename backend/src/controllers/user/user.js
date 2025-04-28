const mongoose = require("mongoose");
const User = require("../../models/user/user");

module.exports = {
  signUp: async (req, res) => {
    const { username, firstName, lastName, password } = req.body;
    try {
      const user = await User.create({
        username,
        firstName,
        lastName,
        password,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username, password });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  allUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
