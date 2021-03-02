const express = require("express");
const router = express.Router();
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const authentication = require("../authMiddleware");

router.post("/register", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const persistedUser = await models.User.findOne({
    where: {
      userName: userName,
    },
  });

  if (persistedUser) {
    res.json({ userAddes: false, message: "User already exists!" });
  } else {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        res.json({
          userAdded: false,
          message: "Something went wrong - user cannot created",
        });
      } else {
        const user = await models.User.build({
          userName: userName,
          password: hash,
        });
        user.save().then((result) => res.json({ userAdded: true }));
      }
    });
  }
});

router.post("/login", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const persistedUser = await models.User.findOne({
    where: {
      userName: userName,
    },
  });
  if (persistedUser) {
    bcrypt.compare(password, persistedUser.password, (err, result) => {
      if (result) {
        let token = jwt.sign(
          { userName: userName, userId: persistedUser.id },
          "tokenPassword"
        );
        res.json({
          login: true,
          token: token,
          userName: persistedUser.userName,
        });
      } else {
        res.json({
          login: false,
          message: "Invalid username or password",
        });
      }
    });
  } else {
    res.json({ login: false, message: "Invalid username or password 2" });
  }
});

/*** Display all user's chatrooms ***/

router.get("/display-chatRoom", authentication, async (req, res) => {
  const userId = res.locals.user.userId;
  const user = await models.User.findOne({
    include: [
      {
        model: models.roomUser,
        as: "chatRoom",
        include: {
          model: models.chatRoom,
          as: "roomDetail",
        },
      },
    ],
    where: {
      id: userId,
    },
  });
  const chatRoomResult = user.dataValues.chatRoom;
  const chatRoomList = chatRoomResult.map((chatRoom) => {
    return {
      roomName: chatRoom.dataValues.roomDetail.dataValues.roomName,
      roomId: chatRoom.dataValues.roomDetail.dataValues.id,
    };
  });

  res.json({ roomFetch: true, roomList: chatRoomList });
});

module.exports = router;
