const express = require("express");
const router = express.Router();

const {
  createUser,
  login,
  createPost,
  feed,
  follow,
  viewUserByUsername,
  unfollow,
  like,
  unlike,
  retweet,
  removePost,
} = require("./controller.js");

const authenticate = require("./middlewares/authentication.js");

router.route("/users").post(createUser);
router.route("/users/:username").get(viewUserByUsername);
router.route("/login").post(login);

router.route("/posts").delete(authenticate, removePost);

router.route("/posts").post(authenticate, createPost);
router.route("/feed").get(authenticate, feed);
router.route("/follow").post(authenticate, follow);
router.route("/follow").delete(authenticate, unfollow);

router.route("/likes").post(authenticate, like);
router.route("/likes").delete(authenticate, unlike);

router.route("/retweet").post(authenticate, retweet);

module.exports = router;
