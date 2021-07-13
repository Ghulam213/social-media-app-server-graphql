const gql = require('graphql-tag')

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  type Query {
    getPosts: [Post]!
    getPost(input: ID!): Post
  }

  type Mutation {
    register(input: RegisterInput!): User!
    login(input: LoginInput!): User!
    createPost(input: String!): Post!
    deletePost(input: ID!): Post!
    createComment(input: CommentInput!): Post!
    deleteComment(input: DeleteCommentInput!): Post!
    likePost(input: ID!): Post!
  }

  type Subscription {
    newPostSubscription: Post!
  }
`

const inputTypeDefs = gql`
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input CommentInput {
    postId: ID!
    body: String!
  }

  input DeleteCommentInput {
    postId: ID!
    commentId: ID!
  }
`

module.exports = {
  typeDefs,
  inputTypeDefs,
}
