const express = require("express");
require("./src/config/config");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./src/socket/socket");

const userRoutes = require("./src/routes/user/user");
const roomRoutes = require("./src/routes/room/room");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

app.use(
  cors({
    origin: process.env.FRONTEND_DEV_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

dotenv.config();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const upload = multer();

app.use(upload.none());

app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use(cookieParser());
app.use("/user", userRoutes);
app.use("/room", roomRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cookieParser());

const port = process.env.PORT;
const ip = process.env.IP;

server.listen(port, ip, () => console.log(`Server is running ${ip}:${port}`));
