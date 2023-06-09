const User = require('./models/user');
const Post = require('./models/post');

class Service {
  insertUser(data) {
    const newUser = new User(data);
    return newUser.save();
  }

  selectUsers = (where) => User.find({ ...where, deleted_at: null } || { deleted_at: null }).lean();

  selectUser = (where) =>
    User.findOne({ ...where, deleted_at: null } || { deleted_at: null }).lean();

  insertPost = async (data) => {
    const newPost = new Post(data);
    return newPost.save();
  };

  selectPost = (where) => Post.findOne({ ...where, deleted_at: null } || { deleted_at: null });

  deletePost = async (postId) =>
    Post.updateMany(
      { _id: postId, deleted_at: null },
      { deleted_at: new Date().getTime() },
      { new: true },
    );

  feedService = async (userId) => {
    const user = await User.findById(userId, {
      username: 1,
      following: 1,
      _id: 0,
    })
      .populate('following', 'username')
      .lean();
    if (user) {
      const posts = await Post.find(
        { user: { $in: user.following } },
        { content: 1, _id: 0 },
      ).populate({
        path: 'user',
        select: '_id',
      });

      const result = {
        username: user.username,
        following: user.following.map((f) => ({
          username: f.username,
          posts: posts.map((post) => ({
            content: post.content,
            postId: post.user.id,
          })),
        })),
      };
      return result;
    }
    return { status: 404, message: 'user not found' };
  };
}

module.exports = Service;
