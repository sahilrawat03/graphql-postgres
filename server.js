const express = require('express');
const { applyMiddleware } = require("graphql-middleware");
const { AuthenticationError } = require('apollo-server-express');

const { ApolloServer, gql } = require('apollo-server-express');

// const { graphql, buildSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLSchema, GraphQLError } = require('graphql');

const { Pool } = require('pg');

const app = express();
app.use(express.json());
const schema = require('./graphql/graphql');
const { typeDefs } = require('./graphql/typeDef/schema');
const {resolvers} =require('./graphql/resolvers')
const middleware=require('./middleware/middleware')



app.use("/", require("./routers/userRoutes"));

 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const user = middleware.authenticateUser(req, res);
    if (!user) {
      throw new AuthenticationError('Invalid token. Authentication failed.');
    }
    return {user};
  },
   
});


async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app,path:'/api' });
}
// server.applyMiddleware({ app, path: '/graphql' });

startApolloServer().then(() => {
  app.listen(4400, () => {
    console.log('Server is running on port 4400');
  });
});
