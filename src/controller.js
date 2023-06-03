const {
  insertUser,
  selectUsers,
  selectUser,
  feedService,
  insertPost,
  selectPost,
  deletePost,
} = require("./service.js");
const httpStatus = require("http-status");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("./utils/helpers.js");

const ObjectId = require("mongoose").Types.ObjectId;

const viewUserByUsername = async (req, res, next) => {
  try {
    let user = await selectUser({ username: req.params.username });
    if (user) {
      return res.status(httpStatus.OK).send({
        data: {
          username: user.username,
          numberFollower: user.follower.length,
          numberFollowing: user.following.length,
        },
      });
    }
    next({ status: httpStatus.NOT_FOUND, message: "user not exist" });
  } catch (error) {
    console.error("VIEW USER BY USERNAME ERROR", error);
    next({ ...error, message: "the user could not view" });
  }
};

const createUser = async (req, res, next) => {
  try {
    let user = await selectUser({ email: req.body.email });
    if (user) {
      next({ status: 409, message: "user exist already" });
    }
    req.body.password = passwordToHash(req.body.password);
    const newUser = await insertUser({
      ...req.body,
      following: [],
      follower: [],
    });
    if (newUser) {
      return res.status(httpStatus.CREATED).send({
        message: "user created",
        data: {
          email: newUser.email,
          username: newUser.username,
          id: newUser._id,
        },
      });
    }
  } catch (error) {
    console.error("CREATE USER ERROR", error);
    next({ ...error, message: "the user could not create" });
  }
};

const login = async (req, res, next) => {
  try {
    const user = await selectUser({ email: req.body.email });
    if (user?.password === passwordToHash(req.body.password)) {
      return res.status(httpStatus.OK).send({
        message: "login successful",
        data: {
          id: user._id.toString(),
          access_token: generateAccessToken({
            id: user._id.toString(),
            email: user.email,
          }),
          refresh_token: generateRefreshToken({
            id: user._id.toString(),
            email: user.email,
          }),
        },
      });
    }
    next({
      message: "Email or password wrong",
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    console.error("LOGIN ERROR", error);
    next({ ...error, message: "an error occured while loging in" });
  }
};

const createPost = async (req, res, next) => {
  try {
    const newPost = await insertPost({ ...req.body, user: req.user.id });
    if (newPost) {
      return res.status(httpStatus.CREATED).send({
        message: "the post created",
        data: { postId: newPost._id },
      });
    }
  } catch (error) {
    console.error("POST CREATE ERROR", error);
    next({ ...error, message: "the post could not create" });
  }
};

const feed = async (req, res, next) => {
  try {
    const posts = await feedService(req.user.id);
    if (!posts.status) {
      return res.status(httpStatus.OK).send({
        data: posts,
      });
    }
    // servisten bir hata mesajı döndürülür ve next ile hata fırlatılır
    next(posts);
  } catch (error) {
    console.error("FEED ERROR", error);
    next({ ...error, message: "an error occured fetching the feed" });
  }
};

const follow = async (req, res, next) => {
  try {
    if (req.user.id === req.body.userId) {
      return next({
        status: httpStatus.UNAUTHORIZED,
        message: "you may not follow yourself",
      });
    }
    const user = await selectUser({ _id: req.user.id });
    if (
      user.following.findIndex((f) => f.toString() === req.body.userId) > -1
    ) {
      return next({
        status: httpStatus.CONFLICT,
        message: "you followed already",
      });
    } else {
      const followedUser = await selectUser({ _id: req.body.userId });
      if (followedUser) {
        user.following.push(new ObjectId(req.body.userId));
        followedUser.follower.push(new ObjectId(req.user.id));
        await user.save();
        await followedUser.save();
        return res
          .status(httpStatus.OK)
          .send({ message: "followed successfully" });
      }
      return next({ status: 404, message: "user to follow not found" });
    }
  } catch (error) {
    console.error("USER FOLLOW ERROR", error);
    next({ ...error, message: "the post could not follow" });
  }
};

const unfollow = async (req, res, next) => {
  try {
    if (req.user.id === req.body.userId) {
      return next({
        status: httpStatus.UNAUTHORIZED,
        message: "you may not unfollow yourself",
      });
    }
    userIdToUnfollow = req.body.userId;
    const user = await selectUser({ _id: req.user.id });
    const followIndex = user.following.findIndex(
      (f) => f.toString() === userIdToUnfollow
    );
    if (followIndex === -1) {
      return next({
        status: httpStatus.CONFLICT,
        message: "not followed already",
      });
    } else {
      const unfollowedUser = await selectUser({ _id: userIdToUnfollow });
      if (unfollowedUser) {
        user.following.splice(followIndex);
        unfollowedUser.follower = unfollowedUser.follower.filter(
          (follower) => follower._id !== req.user.id
        );
        await user.save();
        return res
          .status(httpStatus.OK)
          .send({ message: "unfollowed successfully" });
      }
      return next({ status: 404, message: "user to unfollow not found" });
    }
  } catch (error) {
    console.error("USER UNFOLLOW ERROR", error);
    next({ ...error, message: "the user could not unfollow" });
  }
};

const like = async (req, res, next) => {
  const postIdToLike = req.body.postId;
  try {
    const post = await selectPost({ _id: postIdToLike });
    if (post) {
      if (
        post.likes.findIndex((like) => like.toString() === req.user.id) > -1
      ) {
        return next({
          status: httpStatus.CONFLICT,
          message: "liked already",
        });
      } else {
        post.likes.push(new ObjectId(req.user.id));
        await post.save();
        return res.status(200).send({ message: "liked successfully" });
      }
    }
    return next({ status: 404, message: "post to like not found" });
  } catch (error) {
    console.error("POST LIKE ERROR", error);
    next({ ...error, message: "the post could not like" });
  }
};

const unlike = async (req, res, next) => {
  const postIdToUnlike = req.body.postId;
  try {
    const post = await selectPost({ _id: postIdToUnlike });
    if (post) {
      const likeIndex = post.likes.findIndex(
        (like) => like.toString() === req.user.id
      );
      if (likeIndex === -1) {
        return next({
          status: httpStatus.CONFLICT,
          message: "not liked already",
        });
      } else {
        post.likes.splice(likeIndex);
        await post.save();
        return res.status(200).send({ message: "unliked successfully" });
      }
    }
    return next({ status: 404, message: "post to unlike not found" });
  } catch (error) {
    console.error("POST UNLIKE ERROR", error);
    next({ ...error, message: "the post could not unlike" });
  }
};

const retweet = async (req, res, next) => {
  try {
    const post = await selectPost({ _id: req.body.postId });
    if (post) {
      const retweetedPost = await insertPost({
        content: post.content,
        user: req.user.id,
        owner: post.user,
      });
      if (retweetedPost) {
        post.retweet.push(new ObjectId(req.user.id));
        await post.save();
      }
      return res.status(httpStatus.CREATED).send({
        message: "the post retweeted",
        data: {
          retweetedPostId: retweetedPost._id,
        },
      });
    }
    return next({ status: 404, message: "the post to retweet not found" });
  } catch (error) {
    console.error("POST RETWEET ERROR", error);
    next({ ...error, message: "the post could not retweet" });
  }
};

const removePost = async (req, res, next) => {
  try {
    const post = await selectPost({ _id: req.body.postId });
    if (post) {
      // you may not delete you dont own
      if (post.user.toString() === req.user.id) {
        const deletedPost = await deletePost(req.body.postId);
        if (deletedPost.modifiedCount > 0) {
          return res.status(httpStatus.OK).send({
            message: "the post deleted successfully",
          });
        }
      }
      return next({
        status: httpStatus.FORBIDDEN,
        message: "cannot delete a post you dont own",
      });
    }
    return next({ status: 404, message: "the post not found" });
  } catch (error) {
    console.error("POST DELETE ERROR", error);
    return next({ ...error, message: "the post could not delete" });
  }
};

module.exports = {
  createUser,
  login,
  viewUserByUsername,
  createPost,
  feed,
  unfollow,
  follow,
  like,
  unlike,
  retweet,
  removePost,
};
