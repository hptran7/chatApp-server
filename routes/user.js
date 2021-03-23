const express = require("express");
const router = express.Router();
const models = require("../models");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const authentication = require("../authMiddleware");
const { cloudinary } = require("../utils/cloudinary");

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
    bcrypt.genSalt(10, function (salt) {
      bcrypt.hash(password, salt, null, async function (err, hash) {
        if (err) {
          res.json({
            userAdded: false,
            message: "Something went wrong - user cannot created",
          });
        } else {
          const user = await models.User.build({
            userName: userName,
            password: hash,
            avatar: "wvjrjqdys9uqls7aemfg",
          });
          user.save().then((result) => res.json({ userAdded: true }));
        }
      });
    });
    // bcrypt.hash(password, saltRounds, null, async (err, hash) => {

    // });
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
          userAvatar: persistedUser.avatar,
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

/*** upload Image to Cloudinary and database ***/
router.post("/upload-avatar", authentication, async (req, res) => {
  const userId = res.locals.user.userId;
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ml_default",
    });
    await models.User.update(
      {
        avatar: uploadResponse.public_id,
      },
      {
        where: {
          id: userId,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
