
const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const jwt = require("../jwt");
const jsonwebtoken = require("jsonwebtoken");

const users = require('../models/user')


router.post("/login", async (req, res) => {
  let user = await users.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      if (user.statusActive !== false) {

        const payload = {
          id: user._id,
          level: user.level,
          username: user.email
        };

        let token = jwt.sign(payload);

        res.json({ result: "success", token, message: "Login successfully" });
      } else {
        return res.json({
          result: "error",
          message: "Your need to activate account first"
        });
      }
    } else {
      return res.json({
        result: "error",
        message: "wrong password"
      });
    }
  } else {
    return res.json({
      result: "error",
      message: "User does not exist"
    });
  }
});


router.get("/activation/:token", async (req, res) => {
  const token = req.params.token;
  if (token) {
    jsonwebtoken.verify(token, "JWT_ACCOUNT_ACTIVATION", function (
      err,
      decoded
    ) {
      if (err) {
        console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
        return res.redirect("http://localhost:3000/login/error");
      }
    });

    const updatedFields = {
      statusActive: true,
      activatedToken: ""
    };

    const user = await users.findOneAndUpdate(
      { activatedToken: token },
      updatedFields
    );

    if (user) {
      return res.redirect("http://localhost:3000/login/success");
    }
  }
});

module.exports = router;