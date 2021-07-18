# social-media-app-server-graphql

It is a Apollo (GraphQL) server that is made for a Social Media App project.

## Setting Up

First Clone the repo and then install dependencies. Make sure you have [node](https://nodejs.org/en/) installed.  
Make a config.js file in ./src folder and add following:

```js
module.exports = {
  MONGODB: <link to your mongoDb>,
  JWT_SECRET: <jwt secret>,
}
```

Then install the dependencies.

```bash
npm install
```

Then you can start the server by following command:

```bash
npm run serve
```

Now the server will be live on the url print in your console. Open the link and you will see GraphQL playground. Explore the Schema and Docs and Enjoy!
