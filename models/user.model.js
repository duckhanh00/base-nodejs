const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String,
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    githubId: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        match: /[a-zA-Z0-9]{3,30}/,
    },
    phone: {
        type: String
    },
    status: {   
        type: String,
    },
    avatar: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    fcmToken: {
        type: String
    }
})

module.exports = mongoose.model("users", UserSchema);