const schema = `#graphql
  type User {
    username: String!
    email: String!
    password: String!
  }

  type Post {
    content: String!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
    user(id: String!): User!
    post: Post!
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(userInput: CreateUserInput): User!
    createPost(content: String!): Post!
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`;

export default schema;
