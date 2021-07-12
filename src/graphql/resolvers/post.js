const { AuthenticationError } = require('apollo-server')

const Post = require('../../models/Post')
const { checkAuth } = require('../../utils/auth')

const getPosts = async () => {
  try {
    var posts = await Post.find().sort({ createdAt: -1 })
    posts = posts.map((post) => ({
      id: post.id,
      body: post.body,
      createdAt: post.createdAt,
      username: post.username,
    }))
    return posts
  } catch (err) {
    throw new Error(err)
  }
}

const getPost = async (_, { input }) => {
  try {
    const post = await Post.findById(input)
    if (post) {
      return {
        id: post.id,
        body: post.body,
        createdAt: post.createdAt,
        username: post.username,
      }
    }

    throw new Error('Post not Found')
  } catch (err) {
    throw new Error(err)
  }
}

const createPost = async (_, { input }, context) => {
  const user = checkAuth(context)

  try {
    const post = await Post.create({
      body: input,
      createdAt: new Date().toISOString(),
      username: user.username,
      user: user.id,
    })
    return post
  } catch (err) {
    throw new Error(err)
  }
}

const deletePost = async (_, { input }, context) => {
  const user = checkAuth(context)
  try {
    const post = await Post.findById(input)
    if (post && post.username === user.username) {
      await post.delete()
      return post
    }

    throw new AuthenticationError('Action not allowed', {
      message: 'You are not authorized to delete this post',
    })
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  Query: {
    getPosts,
    getPost,
  },

  Mutation: {
    createPost,
    deletePost,
  },
}
