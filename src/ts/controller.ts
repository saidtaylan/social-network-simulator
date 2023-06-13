import httpStatus from 'http-status'
import { Types } from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import type Service from './service'
import Authentication from './middlewares/authentication'
import Validator from './middlewares/validation'
import { passwordToHash, generateAccessToken, generateRefreshToken } from './utils/helpers'
import * as Responses from './interfaces/responses'
import { IUser } from './models/user'
import { IError } from './interfaces/error'
import { Controller, Get, Post, Delete } from './decorators/http'

@Controller('/')
class MainController {
  constructor(private readonly service: Service, private readonly authentication: Authentication, private readonly validator: Validator) { }

  @Get('users')
  async viewUsers(req: Request, res: Response, next: NextFunction) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const userCursor = await this.service.selectUsers({});

    userCursor.on('data', (user) => {
      res.write(JSON.stringify(user));
    });

    userCursor.on('end', () => {
      res.end('user stream finished');
    });
  }

  @Get('users/:username')
  async viewUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.selectUser({
        username: req.params.username,
      });
      if (user) {
        return res.status(httpStatus.OK).send({
          data: {
            username: user.username,
            numberFollower: user.follower.length,
            numberFollowing: user.following.length,
          },
        });
      }
      next({ status: httpStatus.NOT_FOUND, message: 'user not exist' });
    } catch (error) {
      console.error('VIEW USER BY USERNAME ERROR', error);
      next({ ...error as object, message: 'the user could not view' });
    }
  }

  @Post('/users')
  async createUser(req: Request & { body: { email: string } }, res: Response, next: NextFunction) {
    try {
      const user = await this.service.selectUser({ email: req.body.email });
      if (user) {
        return next({ status: 409, message: 'user exist already' });
      }
      req.body.password = passwordToHash(req.body.password);
      const newUser = await this.service.insertUser({
        ...req.body,
        following: [],
        follower: [],
      });
      if (newUser) {
        return res.status(httpStatus.CREATED).send({
          message: 'user created',
          data: {
            email: newUser.email,
            username: newUser.username,
            id: newUser.id,
          },
        });
      }
    } catch (error) {
      console.error('CREATE USER ERROR', error);
      next({ ...error as object, message: 'the user could not create' });
    }
  }

  @Post('login')
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUser | null = await this.service.selectUser({ email: req.body.email });
      if (user && user.password === passwordToHash(req.body.password)) {
        return res.status(httpStatus.OK).send({
          message: 'login successful',
          data: {
            id: user._id.toString(),
            access_token: generateAccessToken({
              id: user.id.toString(),
              email: user.email,
            }),
            refresh_token: generateRefreshToken({
              id: user.id.toString(),
              email: user.email,
            }),
          },
        });
      }
      next({
        message: 'Email or password wrong',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      console.error('LOGIN ERROR', error);
      next({ ...error as object, message: 'an error occured while loging in' });
    }
  }

  @Post('posts')
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const newPost = await this.service.insertPost({
        ...req.body,
        user: req.user?.id || '',
      });
      console.log('newPost', newPost)
      if (newPost) {
        return res.status(httpStatus.CREATED).send({
          message: 'the post created',
          data: { postId: newPost.id },
        });
      }
    } catch (error) {
      console.error('POST CREATE ERROR', error);
      next({ ...error as object, message: 'the post could not create' });
    }
  }

  @Get('feed')
  async feed(req: Request, res: Response, next: NextFunction) {
    try {
      const posts: Responses.Feed | IError = await this.service.feed(req.user?.id || '');
      if ('status' in posts) {
        return res.status(httpStatus.OK).send({
          data: posts,
        });
      }
      // servisten bir hata mesajı döndürülür ve next ile hata fırlatılır
      next(posts);
    } catch (error) {
      console.error('FEED ERROR', error);
      next({ ...error as object, message: 'an error occured fetching the feed' });
    }
  }

  @Post('follow')
  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.id || '' === req.body.userId) {
        return next({
          status: httpStatus.UNAUTHORIZED,
          message: 'you may not follow yourself',
        });
      }
      console.log('this', this)
      const user: IUser | null = await this.service.selectUser({ _id: req.user?.id || '' });
      if (user) {
        if (user.following.findIndex((f: Types.ObjectId) => f.toString() === req.body.userId) > -1) {
          return next({
            status: httpStatus.CONFLICT,
            message: 'you followed already',
          });
        }
        const followedUser = await this.service.selectUser({
          _id: req.body.userId,
        });
        if (followedUser) {
          user.following.push(new Types.ObjectId(req.body.userId));
          followedUser.follower.push(new Types.ObjectId(req.user?.id || ''));
          await user.save();
          await followedUser.save();
          return res.status(httpStatus.OK).send({ message: 'followed successfully' });
        }
      }
      return next({ status: 404, message: 'user to follow not found' });
    } catch (error) {
      console.error('USER FOLLOW ERROR', error);
      next({ ...error as object, message: 'the user could not follow' });
    }
  }

  @Post('unfollow')
  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.id || '' === req.body.userId) {
        return next({
          status: httpStatus.UNAUTHORIZED,
          message: 'you may not unfollow yourself',
        });
      }
      const userIdToUnfollow = req.body.userId;
      const user: IUser | null = await this.service.selectUser({ _id: req.user?.id || '' });
      if (user) {
        const followIndex = user.following.findIndex((f: Types.ObjectId) => f.toString() === userIdToUnfollow);
        if (followIndex === -1) {
          return next({
            status: httpStatus.CONFLICT,
            message: 'not followed already',
          });
        }
        const unfollowedUser = await this.service.selectUser({
          _id: userIdToUnfollow,
        });
        if (unfollowedUser) {
          user.following.splice(followIndex);
          unfollowedUser.follower = unfollowedUser.follower.filter(
            (follower: Types.ObjectId) => follower.toString() !== req.user?.id || '',
          );
          await user.save();
          return res.status(httpStatus.OK).send({ message: 'unfollowed successfully' });
        }
      }
      return next({ status: 404, message: 'user to unfollow not found' });
    } catch (error) {
      console.error('USER UNFOLLOW ERROR', error);
      return next({ ...error as object, message: 'the user could not unfollow' });
    }
  }

  @Post('like')
  async like(req: Request, res: Response, next: NextFunction) {
    const postIdToLike = req.body.postId;
    try {
      const post = await this.service.selectPost({ _id: postIdToLike });
      if (post) {
        if (post.likes.findIndex((l) => l.toString() === req.user?.id || '') > -1) {
          return next({
            status: httpStatus.CONFLICT,
            message: 'liked already',
          });
        }
        post.likes.push(new Types.ObjectId(req.user?.id || ''));
        await post.save();
        return res.status(200).send({ message: 'liked successfully' });
      }
      return next({ status: 404, message: 'post to like not found' });
    } catch (error) {
      console.error('POST LIKE ERROR', error);
      next({ ...error as object, message: 'the post could not like' });
    }
  }

  @Post('unlike')
  async unlike(req: Request, res: Response, next: NextFunction) {
    const postIdToUnlike = req.body.postId;
    try {
      const post = await this.service.selectPost({ _id: postIdToUnlike });
      if (post) {
        const likeIndex = post.likes.findIndex((l) => l.toString() === req.user?.id || '');
        if (likeIndex === -1) {
          return next({
            status: httpStatus.CONFLICT,
            message: 'not liked already',
          });
        }
        post.likes.splice(likeIndex);
        await post.save();
        return res.status(200).send({ message: 'unliked successfully' });
      }
      return next({ status: 404, message: 'post to unlike not found' });
    } catch (error) {
      console.error('POST UNLIKE ERROR', error);
      next({ ...error as object, message: 'the post could not unlike' });
    }
  }

  @Post('retweet')
  async retweet(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.service.selectPost({ _id: req.body.postId });
      if (post) {
        const retweetedPost = await this.service.insertPost({
          content: post.content,
          user: req.user?.id || '',
          owner: post.user,
        });
        if (retweetedPost) {
          post.retweet.push(new Types.ObjectId(req.user?.id || ''));
          await post.save();
        }
        return res.status(httpStatus.CREATED).send({
          message: 'the post retweeted',
          data: {
            retweetedPostId: retweetedPost.id,
          },
        });
      }
      return next({ status: 404, message: 'the post to retweet not found' });
    } catch (error) {
      console.error('POST RETWEET ERROR', error);
      next({ ...error as object, message: 'the post could not retweet' });
    }
  }

  @Delete('posts')
  async removePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.service.selectPost({ _id: req.body.postId });
      if (post) {
        // you may not delete you dont own
        if (post.user.toString() === req.user?.id || '') {
          const deletedPost = await this.service.deletePost(req.body.postId);
          if (deletedPost.modifiedCount > 0) {
            return res.status(httpStatus.OK).send({
              message: 'the post deleted successfully',
            });
          }
        }
        return next({
          status: httpStatus.FORBIDDEN,
          message: 'cannot delete a post you dont own',
        });
      }
      return next({ status: 404, message: 'the post not found' });
    } catch (error) {
      console.error('POST DELETE ERROR', error);
      return next({ ...error as object, message: 'the post could not delete' });
    }
  }
}
export default MainController