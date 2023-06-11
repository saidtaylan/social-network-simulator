import { UserModel, User } from './models/user'
import { PostModel, Post } from './models/post'
import { HydratedDocument, PopulatedDoc, Types } from 'mongoose';
import * as Responses from './interfaces/responses'
import { IError } from './interfaces/error'

export default class Service {

  insertUser(data: {}): Promise<User> {
    const newUser = new UserModel(data);
    return newUser.save();
  }

  selectUsers = async (where: {}) => UserModel.find({ ...where, deleted_at: null } || { deleted_at: null }).cursor({ batchSize: 10 });

  selectUser = async (where: {}): Promise<User | null> => UserModel.findOne({ ...where, deleted_at: null } || { deleted_at: null })

  insertPost = async (data: {}): Promise<Post> => {
    const newPost = new PostModel(data);
    return newPost.save();
  };

  selectPost = (where: {}) => PostModel.findOne({ ...where, deleted_at: null } || { deleted_at: null });

  deletePost = async (postId: String) =>
    PostModel.updateMany(
      { _id: postId, deleted_at: null },
      { deleted_at: new Date().getTime() },
      { new: true },
    );

  async feed(userId: string) {
    const user: HydratedDocument<User> | null = await UserModel.findById(userId, {
      _id: 0,
    })
      .populate({
        path: 'following',
        select: 'username'
      })
    if (user) {
      const posts: HydratedDocument<Post>[] | null = await PostModel.find(
        { user: { $in: user.following } },
        { content: 1, _id: 0 },
      ).populate({
        path: 'user',
        select: '_id',
      });
      console.log('posts', posts)

      const result = {
        username: user.username,
        following: user.following.map((f: PopulatedDoc<User>) => ({
          username: (f as User).username,
          posts: posts.map((post: Post) => ({
            content: post.content,
            postId: post.user._id,
          })),
        })),
      };
      return <Responses.Feed>result;
    }
    return <IError>{ status: 404, message: 'user not found' };
  };
}

module.exports = Service;
