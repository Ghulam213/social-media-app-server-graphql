const { AuthenticationError, UserInputError } = require('apollo-server')

const Post = require('../../models/Post')
const { checkAuth } = require('../../utils/auth')

const likeCount = (post) => post.likes.length
const commentCount = (post) => post.comments.length

const getPosts = async () => {
  try {
    var posts = await Post.find().sort({ createdAt: -1 })
    return posts
  } catch (err) {
    throw new Error(err)
  }
}

const getPost = async (_, { input }) => {
  try {
    const post = await Post.findById(input)
    if (post) {
      return post
    }

    throw new Error('Post not Found')
  } catch (err) {
    throw new Error(err)
  }
}

const createPost = async (_, { input }, context) => {
  const user = checkAuth(context)

  try {
    if (input.trim() === '') {
      throw new UserInputError('Post Body should not be empty')
    }
    const post = await Post.create({
      body: input,
      createdAt: new Date().toISOString(),
      username: user.username,
      user: user.id,
    })
    // for subscription | sending notification
    context.pubsub.publish('NEW_POST_CREATED', {
      // feild name should be same as subscription name
      newPostSubscription: post,
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

const likePost = async (_, { input }, context) => {
  const user = checkAuth(context)

  const post = await Post.findById(input)
  if (!post) {
    throw new UserInputError('Post not found', {
      errors: { message: 'Post with given Id does not exits' },
    })
  }

  const like = post.likes.find((l) => l.username === user.username)
  if (like) {
    // post already liked, unlike it
    post.likes = post.likes.filter((l) => l.username !== user.username)
  } else {
    // post not liked, like it
    post.likes.push({
      username: user.username,
      createdAt: new Date().toISOString(),
    })
  }
  await post.save()
  return post
}

// must be object with subscribe feild on it
const newPostSubscription = {
  subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST_CREATED'),
}

module.exports = {
  Post: {
    likeCount,
    commentCount,
  },

  Query: {
    getPosts,
    getPost,
  },

  Mutation: {
    createPost,
    deletePost,
    likePost,
  },

  Subscription: {
    newPostSubscription,
  },
}
