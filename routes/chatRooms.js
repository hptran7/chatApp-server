const express = require("express");
const router = express.Router();
const models = require("../models");
const authentication = require("../authMiddleware");

router.post("/create-room", authentication, async (req, res) => {
  const userId = res.locals.user.userId;
  const roomName = req.body.roomName;
  const room = await models.chatRoom.build({
    host: userId,
    roomName: roomName,
  });
  room.save().then((result) => {
    res.json({ roomCreated: true });
  });
});

router.post("/add-user", async (req, res) => {
  const userName = req.body.userName;

  const persistedUser = await models.User.findOne({
    where: {
      userName: userName,
    },
  });

  if (persistedUser) {
    const roomId = req.body.roomId;
    const addUser = await models.roomUser.build({
      roomId: roomId,
      userName: userName,
      userId: persistedUser.id,
    });
    addUser.save().then((result) => {
      res.json({
        addUser: true,
        message: "This user has been added to the chatroom",
      });
    });
  } else {
    res.json({ addUser: false, message: "This username is invalid" });
  }
});

router.post("/send-messages", authentication, async (req, res) => {
  const userId = res.locals.user.userId;
  const roomId = req.body.roomId;
  const message = req.body.message;
  const userName = res.locals.user.userName;

  const newMessage = await models.roomMessage.build({
    roomId: roomId,
    userId: userId,
    userName: userName,
    message: message,
  });

  newMessage.save().then((result) => {
    res.json({
      messageSave: true,
      message: "New message has been saved to database",
    });
  });
});

//*** display message ***/

router.get("/view-messages/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const chatRoom = await models.chatRoom.findOne({
    include: [
      {
        model: models.roomMessage,
        as: "messages",
      },
    ],
    where: {
      id: roomId,
    },
  });
  const allMessages = chatRoom.dataValues.messages;
  // console.log(allMessages);
  const messageList = allMessages.map((message) => {
    return {
      userName: message.dataValues.userName,
      message: message.dataValues.message,
      date: message.dataValues.createdAt,
    };
  });
  console.log(messageList);
  res.json({ message: messageList, displayMessage: true });
});

module.exports = router;
