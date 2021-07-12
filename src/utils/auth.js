const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../config')

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}

const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    // format => Bearer [token]
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
        return jwt.verify(token, JWT_SECRET)
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired Token')
      }
    }
    throw new Error('Invalid token format')
  }
  throw new Error('Authentication Header must be provided')
}

module.exports = {
  generateToken,
  checkAuth,
}
