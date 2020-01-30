const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("./jwt");
const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config()
require('./db');

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_API);

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

    //const { username, email } = req.body;
    const { first_name, last_name, email } = req.body;

    const token = jsonwebtoken.sign(
      { first_name, last_name, email },
      "process.env.JWT_ACCOUNT_ACTIVATION",
      { expiresIn: "7d" }
    );

    const emailData = {
      from: "admin@business.com",
      to: email,
      subject: `Account activation link`,
      html: `
          <h1>Please use the following link to activate your account</h1>
          <a href="localhost:3000/activation/${token}">Activate account</a>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>and link will  expired in 60 minutes</p>
      `
    };

    req.body.activatedToken = token;

    let user = await Users.create(req.body).catch(err => {
      return res.json({
        result: "error",
        message: err.message
      });
    });


    sgMail
      .send(emailData)
      .then(sent => {
        console.log('SIGNUP EMAIL SENT', sent)
        return res.json({
          result: "success",
          message: `Email has been sent to ${email}. Follow the instruction to activate your account`
        });
      })
      .catch(err => {
        // console.log('SIGNUP EMAIL SENT ERROR', err)
        return res.json({
          result: "error",
          message: err.message
        });
      });
  } catch (err) {
    res.json({ result: "error 1", message: err.errmsg });
  }
});

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {

      const payload = {
        id: user._id,
        level: user.level,
        username: user.username
      };

      let token = jwt.sign(payload);

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