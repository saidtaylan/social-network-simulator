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

  selectUsers = async (where?: { id?: string, email?: string }) => UserModel.find({ ...where, deleted_at: null } || { deleted_at: null }).cursor({ batchSize: 10 });

  selectUser = async (where: { id: string }): Promise<IUser | null> => UserModel.findOne({ ...where, deleted_at: null } || { deleted_at: null })

  insertPost = async (data: CreatePostDto): Promise<IPost> => {
    const newPost = new PostModel(data);
    return newPost.save();
  };

  selectPost = (where: { id: string }) => PostModel.findOne({ ...where, deleted_at: null } || { deleted_at: null });

  deletePost = async (postId: string) =>
    PostModel.updateMany(
      { _id: postId, deleted_at: null },
      { deleted_at: new Date().getTime() },
      { new: true },
    );

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
