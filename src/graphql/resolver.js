class Resolver {
  constructor(service) {
    this.service = service;
  }

  list = () => ({
    users: async () => {
      const users = await this.service.selectUsers({});
      return users;
    },

    user: async ({ id }) => this.service.selectUser({ _id: id }),

    createUser: async ({ userInput }) => this.service.insertUser(userInput),

    posts: async ({ postIds }) => this.service.selectPosts(postIds || {}),

    post: async ({ postId }) => this.service.selectPost({ id: postId }),

    createPost: async ({ content }) => this.service.insertPost({ content }),
  });
}

module.exports = Resolver;
