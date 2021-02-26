const express = require("express");
const router = express.Router();
const models = require("../models");
const authentication = require("../authMiddleware");

router.post("/create-room", authentication, async (req, res) => {
  const userId = res.locals.user.userId;
  const room = await models.chatRoom.build({
    host: userId,
  });
  room.save().then((result) => {
    res.json({ roomCreated: true });
  });
});

module.exports = router;
