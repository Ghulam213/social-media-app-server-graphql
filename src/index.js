const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')

const { typeDefs, inputTypeDefs } = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config')

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs: [typeDefs, inputTypeDefs],
  resolvers,
  context: (req) => {
    return {
      ...req,
      pubsub,
    }
  },
})

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MONGODB')
    return server.listen({ port: 5000 }).then((res) => {
      console.log(`Server Running at ${res.url}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })
