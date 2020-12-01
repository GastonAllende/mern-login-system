const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/password");

router.post("/reset", passwordController.forgotPassword);
router.put("/reset", passwordController.resetPassword);

module.exports = router;
