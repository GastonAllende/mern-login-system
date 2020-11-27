const users = require("../models/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("../jwt");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

exports.registerUser = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        const { email } = req.body;
        const token = jsonwebtoken.sign({ email }, "JWT_ACCOUNT_ACTIVATION", {
            expiresIn: "1d",
        });

        req.body.activatedToken = token;

        await users.create(req.body).catch((err) => {
            return res.json({
                result: "error",
                message: err.message,
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
          <p>and link will  expired in 24 hours</p>
      `,
        };

        sgMail
            .send(emailData)
            .then((sent) => {
                return res.json({
                    result: "success",
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                });
            })
            .catch((err) => {
                return res.json({
                    result: "error",
                    message: err.message,
                });
            });
    } catch (err) {
        res.json({ result: "error", message: err.message });
    }
};

exports.login = async (req, res) => {
    let user = await users.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            if (user.statusActive !== false) {
                const payload = {
                    id: user._id,
                    level: user.level,
                    username: user.email,
                };

                let token = jwt.sign(payload);

                res.json({
                    result: "success",
                    token,
                    message: "Login successfully",
                });
            } else {
                return res.json({
                    result: "error",
                    message: "Your need to activate account first",
                });
            }
        } else {
            return res.json({
                result: "error",
                message: "wrong password",
            });
        }
    } else {
        return res.json({
            result: "error",
            message: "User does not exist",
        });
    }
};

exports.activation = async (req, res) => {
    const token = req.params.token;
    if (token) {
        jsonwebtoken.verify(token, "JWT_ACCOUNT_ACTIVATION", function (err, decoded) {
            if (err) {
                console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
                return res.redirect("http://localhost:3000/login/error");
            }
        });

        const updatedFields = {
            statusActive: true,
            activatedToken: "",
        };

        const user = await users.findOneAndUpdate({ activatedToken: token }, updatedFields);

        if (user) {
            return res.redirect("http://localhost:3000/login/success");
        }
    }
};
