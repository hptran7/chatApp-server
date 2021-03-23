// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const socketio = require("socket.io");
// const http = require("http");

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server, {
//   cors: {
//     origin: "https://powerful-citadel-38170.herokuapp.com/",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Authorization"],
//   },
// });

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(cors());

// const PORT = process.env.PORT || 8080;

// // Routes //
// const userRoutes = require("./routes/user");
// const chatRoomsRoutes = require("./routes/chatRooms");

// app.use("/user", userRoutes);
// app.use("/chat-room", chatRoomsRoutes);

// io.on("connection", (socket) => {
//   // console.log("We have a new connection");
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     // console.log(`new user has joined ${roomId}`);
//   });
//   socket.on("leaveRoom", (roomId) => {
//     socket.leave(roomId);
//     // console.log(`new user has joined ${roomId}`);
//   });

//   socket.on("sendMessage", (messageDetail, callback) => {
//     io.in(messageDetail.roomId).emit("message", {
//       user: messageDetail.userName,
//       text: messageDetail.message,
//     });
//     callback();
//   });

//   socket.on("disconnect", () => {
//     // console.log("User has left!!");
//   });
// });

// app.get("/", (req, res) => {
//   res.json({ Hello: "hello" });
// });

// server.listen(PORT, () => {
//   console.log("server is runing");
// });
const express = require("express");
const app = express();
const models = require("./models");
const sequelize = require("sequelize");
const cors = require("cors");

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded());
app.use(cors());
app.use(express.json());

app.post("/post-score", async (req, res) => {
  let userName = req.body.userName;
  let wpm = req.body.wpm;
  let point = req.body.point;
  let differences = req.body.differences;
  let words = req.body.words;
  let accuracy = (((words - differences) / words) * 100).toFixed(2);

  let userPoint = await models.leaderboard.build({
    userName: userName,
    wpm: wpm,
    point: point,
    accuracy: accuracy,
  });
  userPoint.save().then(() => {
    res.json({ message: "success" });
  });
});

app.get("/leaderboard", (req, res) => {
  models.leaderboard
    .findAll({
      order: [["point", "DESC"]],
    })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ message: error });
    });
});

app.get("/", (req, res) => {
  res.json({ message: "good" });
});

app.listen(PORT, () => {
  console.log("the sercer is running!");
});
