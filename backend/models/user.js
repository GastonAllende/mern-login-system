const mongoose = require("mongoose");

const schema = mongoose.Schema({
    avatars: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
    },
    statusActive: {
        type: Boolean,
        default: false,
    },
    activatedToken: {
        type: String,
        default: "",
    },
    resetPasswordToken: {
        type: String,
        default: "",
    },
    level: {
        type: String,
        default: "normal",
    },

    created: {
        type: Date,
        default: Date.now,
    },
});

schema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("users", schema);
