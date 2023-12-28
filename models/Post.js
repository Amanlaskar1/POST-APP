const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const User = require("./User");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    content: {
      type: String,
    },
    featuredImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("post", postSchema);
module.exports = Post;
