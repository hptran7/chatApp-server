const express = require("express");
const router = express.Router();
const models = require("../models");
const authentication = require("../authMiddleware");

router.post("/create-room", authentication, async (req, res) => {
  const userId = res.locals.user.userId;
  const roomName = req.body.roomName;
  const persistedUser = await models.User.findOne({
    where: {
      id: userId,
    },
  });
  const room = await models.chatRoom.build({
    host: userId,
    roomName: roomName,
  });
  room.save().then((result) => {
    addUserToRoom(persistedUser.userName, room.id);
    res.json({ roomCreated: true, message: "New chat room has been created!" });
  });
});

router.post("/add-user", async (req, res) => {
  const userName = req.body.userName;
  const roomId = req.body.roomId;

  const result = await addUserToRoom(userName, roomId);
  if (result == "User has been added to the room") {
    res.json({
      addUser: true,
      message: "This user has been added to the chatroom",
    });
  } else if (result == "This username is invalid") {
    res.json({ addUser: false, message: "This username is invalid" });
  } else if (result == "User is already in this room") {
    res.json({ addUser: false, message: "User is already in this room" });
  }

  // const persistedUser = await models.User.findOne({
  //   where: {
  //     userName: userName,
  //   },
  // });

  // if (persistedUser) {
  //   const addUser = await models.roomUser.build({
  //     roomId: roomId,
  //     userName: userName,
  //     userId: persistedUser.id,
  //   });
  //   addUser.save().then((result) => {
  //     res.json({
  //       addUser: true,
  //       message: "This user has been added to the chatroom",
  //     });
  //   });
  // } else {
  //   res.json({ addUser: false, message: "This username is invalid" });
  // }
});

/*** add user to room ***/
const addUserToRoom = async (userName, roomId) => {
  const persistedUser = await models.User.findOne({
    where: {
      userName: userName,
    },
  });

  if (persistedUser) {
    const persistedUserInRoom = await models.roomUser.findOne({
      where: {
        userId: persistedUser.id,
        roomId: roomId,
      },
    });
    if (persistedUserInRoom) {
      return "User is already in this room";
    }
    const addUser = await models.roomUser.build({
      roomId: roomId,
      userName: userName,
      userId: persistedUser.id,
    });
    addUser.save();
    return "User has been added to the room";
  } else {
    return "This username is invalid";
  }
};

router.post("/send-messages/:roomId", authentication, async (req, res) => {
  const userId = res.locals.user.userId;
  const userName = res.locals.user.userName;
  const roomId = req.params.roomId;
  const message = req.body.message;

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

router.get("/view-messages/:roomId", authentication, async (req, res) => {
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
  res.json({ message: messageList, displayMessage: true });
});

/*** view chatroom all users ***/
router.get("/view-users/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  if (!roomId) {
    res.json({ message: "err" });
  }
  const allRoomUsersObject = await models.roomUser.findAll({
    where: {
      roomId: roomId,
    },
    include: [
      {
        model: models.User,
        as: "userDetail",
      },
    ],
  });
  const listOfAllUsers = allRoomUsersObject.map((user) => {
    return {
      username: user.dataValues.userName,
      avatar: user.dataValues.userDetail.dataValues.avatar,
    };
  });

  res.json({ members: listOfAllUsers, displayMember: true });
});

/** remove user from chat room **/
router.post("/leave-room/:roomId", authentication, (req, res) => {
  const roomId = req.params.roomId;
  const userId = res.locals.user.userId;
  models.roomUser.destroy({
    where: {
      roomId: roomId,
      userId: userId,
    },
  });
});

module.exports = router;
