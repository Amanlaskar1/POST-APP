const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Post = require("./Post");
const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "No duplicate email is allowed"],
  },
  password: {
    type: String,
    required: true,
  },
  publishedarticles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
    default: [],
  },
});

const User = model("user", userSchema);

module.exports = User;
