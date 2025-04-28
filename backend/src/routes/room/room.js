const express = require("express");
const router = express.Router();

const room = require("../../controllers/room/room");

router.get("/check", room.roomCheck);
router.post("/create", room.newRoom);
router.get("/messages", room.roomMessages);

module.exports = router;
