const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
require("./db");

app.use(cors());
app.use(bodyParser.json()); // application/json

sgMail.setApiKey(process.env.MAIL_API);

const PORT = 8080;
app.listen(PORT, () => {
    console.log("Server is running... on port " + PORT);
});

app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
