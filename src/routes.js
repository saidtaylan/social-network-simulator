const express = require("express");

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
const validate = require("./middlewares/validation.js");

const validator = require("./validations/index.js");

const router = express.Router();

router.route("/users").post(validate(validator.createUser), createUser);
router
  .route("/users/:username")
  .get(validate(validator.getUser), viewUserByUsername);
router.route("/login").post(validate(validator.login), login);

router
  .route("/posts")
  .post(authenticate, validate(validator.createPost), createPost);
router.route("/posts").delete(authenticate, removePost);
router.route("/retweet").post(authenticate, retweet);

router.route("/feed").get(authenticate, feed);
router.route("/follow").post(authenticate, follow);
router.route("/follow").delete(authenticate, unfollow);

router.route("/likes").post(authenticate, like);
router.route("/likes").delete(authenticate, unlike);

module.exports = router;
