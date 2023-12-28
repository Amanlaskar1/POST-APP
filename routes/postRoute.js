const express = require("express");
const router = express.Router();
const verify = require("../config/JWTVerification");

//Custom imports
const {
  createPost,
  getAllPosts,
  getSinglePost,
  deleteAPost,
  updateAPost,
} = require("../controllers/postController");

router.get("/all", getAllPosts);

router.post("/create", verify, createPost);

router.delete("/delete/:postId", verify, deleteAPost);

router.patch("/update/:postId", verify, updateAPost);

router.get("/:postId", getSinglePost);

module.exports = router;
