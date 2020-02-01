const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("./jwt");
const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config()
require('./db');

// User
const Users = require("./models/user");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_API);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const port = 8080;
app.listen(port, () => {
  console.log("Server is running... on port " + port);
});


app.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);

    //const { username, email } = req.body;
    const { email } = req.body;

    const token = jsonwebtoken.sign(
      { email },
      "JWT_ACCOUNT_ACTIVATION",
      { expiresIn: "7d" }
    );

    const emailData = {
      from: "info@gaston.com",
      to: email,
      subject: `Account activation link`,
      html: `
          <h1>Please use the following link to activate your account</h1>
          <a target="_blank" href="localhost:8080/activation/${token}">Activate account</a>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>and link will  expired in 60 minutes</p>
      `
    };

    req.body.activatedToken = token;

    await Users.create(req.body).catch(err => {
      return res.json({
        result: "error",
        message: err.message
      });
    });

    sgMail
      .send(emailData)
      .then(sent => {
        //console.log('SIGNUP EMAIL SENT', sent)
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
    res.json({ result: "error", message: err.errmsg });
  }
});

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      if (user.statusActive !== false) {

        const payload = {
          id: user._id,
          level: user.level,
          username: user.username
        };

        let token = jwt.sign(payload);
        console.log(token);
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

app.get("/activation/:token", async (req, res) => {
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

    const user = await Users.findOneAndUpdate(
      { activatedToken: token },
      updatedFields
    );

    if (user) {
      return res.redirect("http://localhost:3000/login/success");
    }

  }
});



app.post("/password/reset", async (req, res) => {

  let expired_time = "60m";

  const { email } = req.body;

  Users.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({
        result: "error",
        message: "User with that email does not exist"
      });
    }

    const token = jsonwebtoken.sign(
      { _id: user._id, name: user.first_name },
      "process.env.JWT_RESET_PASSWORD",
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
                <a href="http://localhost:3000/password-reset/${token}">Reset passord link</p>
                <hr />
                <p>This link will expired in 60 minutes</p>
                
            `
    };

    user.updateOne({ resetPasswordToken: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
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

