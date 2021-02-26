const express = require("express");
const router = express.Router();
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

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

module.exports = router;
