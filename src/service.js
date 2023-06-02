const User = require("./models/user.js");
const Post = require("./models/post.js");

const insertUser = (data) => {
  const newUser = new User(data);
  return newUser.save();
};

const selectUsers = (where) => {
  return User.find({ ...where, deleted_at: null } || { deleted_at: null });
};

const selectUser = (where) => {
  return User.findOne({ ...where, deleted_at: null } || { deleted_at: null });
};

const insertPost = (data) => {
  const newPost = new Post(data);
  return newPost.save();
};

const selectPost = (where) => {
  return Post.findOne({ ...where, deleted_at: null } || { deleted_at: null });
};

const deletePost = async (postId) => {
  return Post.updateMany(
    { _id: postId, deleted_at: null },
    { deleted_at: new Date().getTime() },
    { new: true }
  );
};

const feedService = async (userId) => {
  const user = await User.findById(userId, {
    username: 1,
    following: 1,
    _id: 0,
  })
    .populate("following", "username")
    .lean();

  const followingIds = user.following.map((f) => f._id);
  const posts = await Post.find(
    { user: { $in: followingIds } },
    { content: 1, _id: 0 }
  ).populate({
    path: "user",
    select: "_id",
  });

  const result = {
    username: user.username,
    following: user.following.map((user) => ({
      username: user.username,
      posts: posts.map((post) => {
        return { content: post.content, postId: post.user._id };
      }),
    })),
  };
  return result;
};

module.exports = {
  insertUser,
  selectUsers,
  selectUser,
  insertPost,
  selectPost,
  feedService,
  deletePost,
};
