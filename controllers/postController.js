const CustomError = require("../ErrorHandling/Error");
const Post = require("../models/Post");
const User = require("../models/User");

// => New post creation
exports.createPost = async (req, res, next) => {
  const { userId } = req.user;
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError(404, "No such user exists");
  }
  const { title, summary, content, featuredImage } = req.body;

  try {
    const post = await Post.create({
      title,
      summary,
      content,
      featuredImage,
    });
    if (!post) {
      throw new CustomError(500, "Something went wrong in post creation");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { publishedarticles: post._id },
      },
      { new: true }
    );
    return res.json({
      success: true,
      post,
      user,
    });
  } catch (err) {
    return next(err);
  }
};

// => All posts fetching
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});

    if (!posts) {
      throw new CustomError(500, "Something went wrong");
    }
    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(err);
  }
};

// => Fetching a single post
exports.getSinglePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError(404, "No such post exists");
    }

    return res.json({
      success: true,
      post,
    });
  } catch (err) {
    return next(err);
  }
};

// => Delete a post
exports.deleteAPost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);
    if (!post || !user) {
      throw new CustomError(404, "Invalid credentials to delete");
    }
    if (!user.publishedarticles.includes(postId)) {
      throw new CustomError(402, "You are not authorized to delete");
    }
    // Remove postId from user's publishedArticles array
    user.publishedarticles = user.publishedarticles.filter(
      (id) => id.toString() !== postId
    );

    // Save the updated user document
    await user.save();

    const deletedPost = await Post.deleteOne({ _id: postId });
    if (!deletedPost) throw new CustomError(500, "Error deleting post");

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return next(err);
  }
};

// => Edit a post
exports.updateAPost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user.publishedarticles.includes(postId)) {
      throw new CustomError(402, "You are not authorized to update");
    }
    const post = await Post.findById(postId);
    if (!post) throw new CustomError(500, "No such post exists");
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      ...req.body,
    });
    if (!updatedPost) throw new CustomError(500, "Error updating post");
    return res.json({
      success: true,
      updatedPost,
    });
  } catch (err) {
    return next(err);
  }
};
