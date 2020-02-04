
const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const users = require('../models/user')

router.post("/reset", async (req, res) => {

  let expired_time = "60m";

  const { email } = req.body;

  users.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({
        result: "error",
        message: "User with that email does not exist"
      });
    }

    const token = jsonwebtoken.sign(
      { _id: user._id, email: user.email },
      "JWT_RESET_PASSWORD",
      {
        expiresIn: expired_time
      }
    );

    const emailData = {
      from: "admin@basicpos.io",
      to: email,
      subject: `Password Reset link`,
      html: `
              <h1>Please use the following link to reset your password</h1>
              <a href="http://localhost:3000/password-reset/${token}">Reset passord link</a>
              <hr />
              <p>This link will expired in 60 minutes</p>
                
            `
    };

    user.updateOne({ resetPasswordToken: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          result: "error",
          message: "Database connection error on user password forgot request"
        });
      } else {
        sgMail
          .send(emailData)
          .then(response => {
            return res.json({
              result: "success",
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`
            });
          })
          .catch(err => {
            return res.json({ result: "error", message: err.message });
          });
      }
    });
  });
});

router.put("/reset", async (req, res) => {
  const { password } = req.body;
  let resetPasswordToken = req.query.token;
  if (resetPasswordToken) {
    jsonwebtoken.verify(
      resetPasswordToken,
      "JWT_RESET_PASSWORD",
      function (err, decoded) {
        if (err) {
          return res.json({
            result: "error",
            message: "Expired link. Try again"
          });
        }
      }
    );
    let encrypt_pass = await bcrypt.hash(password, 8);
    let updatedFields = {
      password: encrypt_pass,
      resetPasswordToken: ""
    };

    await users.findOneAndUpdate(
      { resetPasswordToken: resetPasswordToken },
      updatedFields
    ).then(responses => {
      return res.json({
        result: "success",
        message: "Password update succesfully your can try login again"
      });
    });
  } else {
    return res.json({
      result: "error",
      message: "No Found Token"
    });
  }
});

module.exports = router;