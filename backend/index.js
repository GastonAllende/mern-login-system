const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("./jwt");
require('./db');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res, next) {
  return res.send("Hello Nodejs");
});
const port = 8080;
app.listen(port, () => {
  console.log("Server is running... on port " + port);
});


const Users = require("./models/user");

app.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    await Users.create(req.body);
    res.json({ result: "success", message: "Register successfully" });
  } catch (err) {
    res.json({ result: "error", message: err.errmsg });
  }
});



app.post("/login", async (req, res) => {
  let doc = await Users.findOne({ email: req.body.email });
  if (doc) {
    if (bcrypt.compareSync(req.body.password, doc.password)) {
      const payload = {
        id: doc._id,
        level: doc.level,
        username: doc.username
      };

      let token = jwt.sign(payload);
      console.log(token);
      res.json({ result: "success", token, message: "Login successfully" });
    } else {
      // Invalid password
      res.json({ result: "error", message: "Invalid password" });
    }
  } else {
    // Invalid username
    res.json({ result: "error", message: "Invalid username" });
  }
});