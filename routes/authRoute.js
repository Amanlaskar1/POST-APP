const express = require("express");
const router = express.Router();

const {
  createUser,
  login,
  loggedInUserData,
} = require("../controllers/authController");
const verify = require("../config/JWTVerification");

router.post("/register", createUser);

router.post("/login", login);

router.get("/getUserData", verify, loggedInUserData);

module.exports = router;
