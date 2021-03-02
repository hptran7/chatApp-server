const jwt = require("jsonwebtoken");
const models = require("./models");
// require("dotenv").config();

async function authentication(req, res, next) {
  let token = "";
  if (req.headers) {
    let headers = req.headers["authorization"];
    token = headers.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, "tokenPassword");
      if (decoded) {
        const userName = decoded.userName;
        const userId = decoded.userId;
        const persistedUser = await models.User.findOne({
          where: {
            userName: userName,
          },
        });
        if (persistedUser) {
          res.locals.user = { userId: userId, userName: userName };
          next();
        } else {
          res.json({ message: "You're not authorized!" });
        }
      } else {
        res.json({ message: "You're not authorized!", error: "database" });
      }
    } else {
      res.json({ message: "You're not authorized!", error: "jwt verify" });
    }
  } else {
    res.json({ message: "You're not authorized!", error: "headers" });
  }
}

module.exports = authentication;
