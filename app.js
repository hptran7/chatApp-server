const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
  },
});

app.use(express.json());
app.use(cors());

// Routes //
const userRoutes = require("./routes/user");
const chatRoomsRoutes = require("./routes/chatRooms");

app.use("/user", userRoutes);
app.use("/chat-room", chatRoomsRoutes);

io.on("connection", (socket) => {
  // console.log("We have a new connection");
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    // console.log(`new user has joined ${roomId}`);
  });

  socket.on("sendMessage", (messageDetail, callback) => {
    io.in(messageDetail.roomId).emit("message", {
      user: messageDetail.userName,
      text: messageDetail.message,
    });
    callback();
  });

  socket.on("disconnect", () => {
    // console.log("User has left!!");
  });
});

server.listen("8080", () => {
  console.log("server is runing");
});
