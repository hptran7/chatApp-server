require("dotenv").config();

const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "https://chat-dc.netlify.app/",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
  },
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Routes //
const userRoutes = require("./routes/user");
const chatRoomsRoutes = require("./routes/chatRooms");

app.use("/user", userRoutes);
app.use("/chat-room", chatRoomsRoutes);

/*** current state to store video room members ***/
const users = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  // console.log("We have a new connection");
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    io.in(roomId).emit("announce", {
      message: "User has join this room",
    });
  });
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    // console.log(`new user has joined ${roomId}`);
  });

  socket.on("joinVideoRoom", (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 10) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("leaveVideoRoom", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });

  socket.on("call video", (payload) => {
    io.in(payload.roomId).emit("video invite", {
      roomId: payload.roomId,
      userName: payload.userName,
    });
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

app.get("/", (req, res) => {
  res.json({ message: "good" });
});

server.listen(PORT, () => {
  console.log("server is runing");
});
