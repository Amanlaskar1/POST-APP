require("dotenv").config();
const CustomError = require("../ErrorHandling/Error");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// => Creating a new user
exports.createUser = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    const user = await User.create({ fullname, email, password });
    if (!user) {
      throw new CustomError(500, "Something went wrong in User creation");
    }
    return res.json({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

// => Logging in a user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, password: password });
    if (!user) {
      throw new CustomError(500, "Invalid credentials");
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    return res.status(200).cookie("access_token", token).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(err);
  }
};

// => Getting logged in user data
exports.loggedInUserData = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(500, "Invalid credentials");
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return next(err);
  }
};
