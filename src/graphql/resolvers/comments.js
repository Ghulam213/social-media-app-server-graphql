const { UserInputError, AuthenticationError } = require('apollo-server')

const Post = require('../../models/Post')
const { checkAuth } = require('../../utils/auth')

const createComment = async (_, { input: { postId, body } }, context) => {
  const user = checkAuth(context)
  if (body.trim() === '') {
    throw new UserInputError('Empty body on Comment', {
      errors: { message: 'The comment body should not be empty!' },
    })
  }
  try {
    const post = await Post.findById(postId)
    if (post) {
      post.comments.unshift({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
      })
      await post.save()
      return post
    }
    throw new UserInputError('Post not found', {
      errors: { message: 'Post with given Id does not exits' },
    })
  } catch (err) {
    throw new Error(err)
  }
}

const deleteComment = async (_, { input: { postId, commentId } }, context) => {
  const user = checkAuth(context)

  const post = await Post.findById(postId)
  if (!post) {
    throw new UserInputError('Post not found', {
      errors: { message: 'Post with given Id does not exits' },
    })
  }
  const comment = post.comments.find((c) => c.id === commentId)
  if (!comment) {
    throw new UserInputError('Comment not found', {
      errors: { message: 'Comment with given Id does not exits' },
    })
  }
  if (comment.username === user.username) {
    post.comments = post.comments.filter((c) => c.id !== commentId)
    await post.save()
    return post
  }
  throw new AuthenticationError('Action not allowed', {
    errors: {
      message: 'You are not authorized to delete this post',
    },
  })
}

module.exports = {
  Mutation: {
    createComment,
    deleteComment,
  },
}
