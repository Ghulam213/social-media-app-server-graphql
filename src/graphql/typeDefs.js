const gql = require('graphql-tag')

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
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
`

module.exports = {
  typeDefs,
  inputTypeDefs,
}
