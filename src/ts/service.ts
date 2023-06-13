import { UserModel, IUser } from './models/user'
import { PostModel, IPost } from './models/post'
import { HydratedDocument, PopulatedDoc } from 'mongoose';
import * as Responses from './interfaces/responses'
import { IError } from './interfaces/error'
import { CreateUserDto } from './dto/user'
import { CreatePostDto } from './dto/post'

export default class Service {

  insertUser(data: CreateUserDto): Promise<IUser> {
    const newUser = new UserModel(data);
    return newUser.save();
  }

  async selectUsers(where?: { _id?: string, email?: string }) {
    return UserModel.find({ ...where, deleted_at: null } || { deleted_at: null }).cursor({ batchSize: 10 });
  }

  async selectUser(where: { _id?: string, email?: string, username?: string }): Promise<IUser | null> {
    return UserModel.findOne({ ...where, deleted_at: null } || { deleted_at: null })
  }
  async insertPost(data: CreatePostDto & { user: string, owner?: string }): Promise<IPost> {
    const newPost = new PostModel(data);
    return newPost.save();
  }

  async selectPost(where: { _id: string }) {
    return PostModel.findOne({ ...where, deleted_at: null } || { deleted_at: null });
  }

  async selectPosts(ids: string[]) {
    return PostModel.find({ _id: { $in: ids }, deleted_at: null } || { deleted_at: null });
  }

  async deletePost(postId: string) {
    return PostModel.updateMany(
      { _id: postId, deleted_at: null },
      { deleted_at: new Date().getTime() },
      { new: true },
    );
  }

  async feed(userId: string) {
    const user: HydratedDocument<IUser> | null = await UserModel.findById(userId, {
      _id: 0,
    })
      .populate({
        path: 'following',
        select: 'username'
      })
    if (user) {
      const posts: HydratedDocument<IPost>[] | null = await PostModel.find(
        { user: { $in: user.following } },
        { content: 1, _id: 0 },
      ).populate({
        path: 'user',
        select: '_id',
      });
      console.log('posts', posts)

      const result = {
        username: user.username,
        following: user.following.map((f: PopulatedDoc<IUser>) => ({
          username: (f as IUser).username,
          posts: posts.map((post: IPost) => ({
            content: post.content,
            postId: post.user._id,
          })),
        })),
      };
      return <Responses.Feed>result;
    }
    return <IError>{ status: 404, message: 'user not found' };
  }
}

module.exports = Service;
