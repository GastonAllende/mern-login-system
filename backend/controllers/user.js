const users = require('../models/user')
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
require('dotenv').config()

exports.registerUser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    const { email } = req.body;
    const token = jsonwebtoken.sign(
      { email },
      "JWT_ACCOUNT_ACTIVATION",
      { expiresIn: "7d" }
    );

    req.body.activatedToken = token;

    await users.create(req.body).catch(err => {
      return res.json({
        result: "error",
        message: err.message
      });
    });

    const emailData = {
      from: "info@gaston.com",
      to: email,
      subject: `Account activation link`,
      html: `
          <h1>Please use the following link to activate your account</h1>
          <a target="_blank" href="localhost:8080/api/auth/activation/${token}">Activate account</a>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>and link will  expired in 60 minutes</p>
      `
    };

    sgMail
      .send(emailData)
      .then(sent => {
        return res.json({
          result: "success",
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`
        });
      })
      .catch(err => {
        return res.json({
          result: "error",
          message: err.message
        });
      });
  } catch (err) {
    res.json({ result: "error", message: err.message });
  }
};
