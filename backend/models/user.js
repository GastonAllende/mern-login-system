
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  avatars: String,
  username: String,
  email: String,
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  password: String,
  status: { type: String, default: "not_activate" },
  activatedToken: { type: String, default: "" },
  level: { type: String, default: "normal" },
  created: { type: Date, default: Date.now }
});

schema.index({ username: 1 }, { unique: true });
module.exports = mongoose.model("users", schema);
