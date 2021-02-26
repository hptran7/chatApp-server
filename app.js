const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Routes //
const userRoutes = require("./routes/user");
const chatRoomsRoutes = require("./routes/chatRooms");

app.use("/user", userRoutes);
app.use("/chat-room", chatRoomsRoutes);

app.listen("8080", () => {
  console.log("server is runing");
});
