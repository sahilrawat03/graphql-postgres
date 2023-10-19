const { gql } = require('apollo-server-express');
const pool=require('../database/db')

 const { authenticateUser } = require('../middleware/middleware');

exports.typeDefs = gql`
type Blog {
  id: Int
  title: String
  content: String
  tags:[String]
  user_id:Int
  knowledgerating: Int
  overallrating: Int
  contentrating:Int
  usercomments:[String]
}

type Query {
  blog(id: Int!): Blog
  getBlogs:[Blog]
}

type Mutation {
  createBlog( title: String  content: String  points:Int tags:[String] user_id:Int): Blog
  updateBlog(id:Int,title: String  content: String  points:Int tags:[String] user_id:Int):Blog
}
`;



exports.resolvers = {
    Query: {
        blog: async (_, { id }) => {
            // authenticateUser(reques)
            const query = `
  SELECT * 
  FROM blogs
  LEFT JOIN ratings ON blogs.id = ratings.blog_id 
  LEFT JOIN comments ON blogs.id = comments.blog_id 
  WHERE blogs.id = $1
`;
        // const query = 'SELECT * FROM blogs  LEFT JOIN ratings ON blogs.id = ratings.blog_id LEFT JOIN comments ON blogs.id = comments.blog_id WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0];
        },
        getBlogs: async (parent, args) => {
            const query = `
            SELECT *
            FROM blogs
            LEFT JOIN ratings ON blogs.id = ratings.blog_id
           LEFT JOIN comments ON blogs.id = comments.blog_id
        `;
            const { rows } = await pool.query(query);
            console.log(rows)
            return rows; 

        },
    },
    Mutation: {
      createBlog: async (_, {title,content,tags,user_id}) => {
          console.log("request")
        //   const query1 = `SELECT * FROM blogs WHERE email=$1`;
          const values=[title,content,tags,user_id];
          console.log(values)
        //   const result = await pool.query(query1,values1);
        //   console.log(result)
        //   if(result.rows.length !=0)     throw new GraphQLError('User already exists.');
        const query = 'INSERT INTO blogs(title, content,tags,user_id) VALUES($1, $2,$3,$4) RETURNING *';
        const { rows } = await pool.query(query, values);
        return rows[0];
        },
        updateBlog: async (_, {id,title,content,tags,user_id}) => {
           //   const query1 = `SELECT * FROM blogs WHERE email=$1`;
           console.log(tags)
           //   const result = await pool.query(query1,values1);
           //   console.log(result)
           //   if(result.rows.length !=0)     throw new GraphQLError('User already exists.');
           const values=[id,title,content,tags,user_id]; 
            const q1 = `Update blogs set title='${title}',content =' ${content}',tags=['${tags}'],user_id= '${user_id}' where id= '${id}' `;
            const query = `
            UPDATE blogs
            SET title = $2, content = $3, tags = $4, user_id = $5
            WHERE id = $1 RETURNING *
          `;
            // const result = await pool.query(query, values);
            let result = await pool.query(query, values)
            console.log(result.rows[0]);

          return result.rows[0];
        },
        deleteBlog: async (_, {id}) => {
            //   const query1 = `SELECT * FROM blogs WHERE email=$1`;
            console.log(tags)
            //   const result = await pool.query(query1,values1);
            //   console.log(result)
            //   if(result.rows.length !=0)     throw new GraphQLError('User already exists.');
            const values=[id]; 
             const query = `
             delete from blogs where id=$1
           `;
             // const result = await pool.query(query, values);
             let result = await pool.query(query, values)
             console.log(result.rows[0]);
 
           return result.rows[0];
         },
    },
  };