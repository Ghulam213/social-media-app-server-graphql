const bcryptjs = require('bcryptjs')
const { UserInputError } = require('apollo-server')

const User = require('../../models/User')
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators')
const { generateToken } = require('../../utils/auth')

const register = async (_, { input }) => {
  var { username, email, password, confirmPassword } = input
  // validate Data
  const { valid, errors } = validateRegisterInput(input)
  if (!valid) throw new UserInputError('Errors', { errors })

  // Make sure user doesn't exist
  const user = await User.findOne({ username })
  if (user) {
    throw new UserInputError('Username is taken', {
      errors: {
        username: 'This username is taken ',
      },
    })
  }
  // Hash Password and create auth token
  password = await bcryptjs.hash(password, 12)

  const newUser = new User({
    email,
    username,
    password,
    createdAt: new Date().toISOString(),
  })

  const res = await newUser.save()
  const token = generateToken(res)

  return {
    ...res._doc,
    id: res._id,
    token,
  }
}

const login = async (_, { input }) => {
  const { username, password } = input
  // validate inputs
  const { errors, valid } = validateLoginInput(input)
  if (!valid) {
    throw new UserInputError('Errors', { errors })
  }

  // find user
  const user = await User.findOne({ username }).exec()
  if (!user) {
    errors.general = 'User not found'
    throw new UserInputError('User not found', { errors })
  }

  // check password match
  const match = await bcryptjs.compare(password, user.password)
  if (!match) {
    errors.general = 'Wrong Credentials'
    throw new UserInputError('Wrong Credentials', { errors })
  }

  const token = generateToken(user)

  return {
    ...user._doc,
    id: user._id,
    token,
  }
}

module.exports = {
  Mutation: {
    register,
    login,
  },
}
