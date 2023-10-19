const express = require('express');

const { ApolloServer, gql } = require('apollo-server-express');

const { graphql, buildSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLSchema, GraphQLError } = require('graphql');

const { Pool } = require('pg');

const app = express();
app.use(express.json());
const schema = require('./graphql/graphql');
const middleware=require('./middleware/middleware')
// Database Connection
// const pool = new Pool({
//   user: 'sahil',
//   host: 'localhost',
//   database: 'testing',
//   password: 'rawat',
//   port: 5432,
// });


app.use("/", require("./routers/userRoutes"));

// // GraphQL Schema
// const typeDefs = gql`
//   type User {
//     id: Int
//     name: String
//     email: String
//   }

//   type Query {
//     user(id: Int!): User
//     getUsers:[User]
//   }

//   type Mutation {
//     createUser(name: String!, email: String!): User
//     updateUser( id: Int,
//         name: String,
//         email: String):User
//   }
// `;

// const resolvers = {
//   Query: {
//     user: async (_, { id }) => {
//       const query = 'SELECT * FROM users WHERE id = $1';
//       const values = [id];
//       const { rows } = await pool.query(query, values);
//       return rows[0];
//     },
//   },
//   Mutation: {
//     createUser: async (_, { name, email }) => {
//         console.log(name,email)
//         const query1 = `SELECT * FROM users WHERE email=$1`;
//         const values1=[email];
//         console.log(values1)
//         const result = await pool.query(query1,values1);
//         console.log(result)
//         if(result.rows.length !=0)     throw new GraphQLError('User already exists.');
//       const query = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *';
//       const values = [name, email];
//       const { rows } = await pool.query(query, values);
//       return rows[0];
//     },
//   },
// };

const server = new ApolloServer({
  typeDefs:schema.typeDefs,
    resolvers: schema.resolvers,
    // context: async ({ req }) => {
    //     // Extract the token from the request headers
    //     const token = req.headers.authorization || '';
    
    //     // Verify the token and authenticate the user
    //     const user = await middleware.authenticateUser(token);
    //     console.log(user)
    
    //     // Attach the authenticated user to the context
    //     return { user };
    //   },
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app,path:'/api' });
}
// server.applyMiddleware({ app, path: '/graphql' });

startApolloServer().then(() => {
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
});
