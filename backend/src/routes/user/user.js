const express = require("express");
const router = express.Router();

const user = require("../../controllers/user/user");

router.post("/signup", user.signUp);
router.post("/login", user.login);
router.get("", user.allUsers);

module.exports = router;
