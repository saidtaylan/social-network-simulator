import { CreateUserDto } from '../dto/user';
import type Service from '../service'
import { Resolve } from '../decorators/graphql'

class Resolver {
  constructor(private readonly service: Service) { }

  @Resolve('Query')
  async users() {
    const users = await this.service.selectUsers({});
    return users;
  }

  @Resolve('Query')
  async user({ id }: { id: string }) {
    return this.service.selectUser({ _id: id })
  }

  @Resolve('Mutation')
  async createUser({ userInput }: { userInput: CreateUserDto }) {
    return this.service.insertUser(userInput)
  }

  @Resolve('Query')
  async posts({ postIds }: { postIds: string[] }) {
    this.service.selectPosts(postIds || {})
  }

  @Resolve('Query')
  async post({ postId }: { postId: string }) {
    this.service.selectPost({ _id: postId })
  }

  @Resolve('Mutation')
  async createPost({ content }: { content: string }) {
    this.service.insertPost({ content, user: 'deneme' })
  }
}

export default Resolver;
