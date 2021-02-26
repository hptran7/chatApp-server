const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Routes //
const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

app.listen("8080", () => {
  console.log("server is runing");
});
