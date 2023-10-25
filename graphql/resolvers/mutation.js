const  pool  = require('../../database/db');
const { GraphQLError } = require('graphql');
const { ApolloError } = require('apollo-server-express');


const createBlog = async (title, content, tags, user_id)=> {
  //   const query1 = `SELECT * FROM blogs WHERE email=$1`;
      const values=[title,content,tags,user_id];
    //   const result = await pool.query(query1,values1);
    //   if(result.rows.length !=0)     throw new GraphQLError('User already exists.');
    const query = 'INSERT INTO blogs(title, content,tags,user_id) VALUES($1, $2,$3,$4) RETURNING *';
    const { rows } = await pool.query(query, values);
    return rows[0];
    };



const updateBlog = async(id,title, content, tags, user_id) =>{

       const values=[id,title,content,tags,user_id]; 
        const q1 = `Update blogs set title='${title}',content =' ${content}',tags=['${tags}'],user_id= '${user_id}' where id= '${id}' `;
        const query = `
        UPDATE blogs
        SET title = $2, content = $3, tags = $4, user_id = $5
        WHERE id = $1 RETURNING *
      `;
        // const result = await pool.query(query, values);
    let result = await pool.query(query, values);
    if (result.rows.length == 0) {
        const error = new ApolloError('Blog not created', 'BAD_REQUEST');
            error.extensions = { code: 'BAD_REQUEST',statusCode:400 };
            throw error;
    }

      return result.rows[0];
    };

const deleteBlog = async (id) => {
    const values=[id]; 
    const query = `
    delete from blogs where id=$1
  `;
    // const result = await pool.query(query, values);
    let result = await pool.query(query, values)

  return result.rows[0];

};

const giveRating = async ( contentrating, knowledgerating, overallrating,blog_id,user_id )=> {
        //   const query1 = `SELECT * FROM blogs WHERE email=$1`;
          const values=[contentrating, knowledgerating, overallrating,blog_id,user_id ];
        //   const result = await pool.query(query1,values1);
        //   if(result.rows.length !=0)     throw new GraphQLError('User already exists.');
        const query = 'INSERT INTO ratings(contentrating, knowledgerating, overallrating,blog_id,user_id ) VALUES($1, $2,$3,$4, $5) RETURNING *';
        const { rows } = await pool.query(query, values);
        return rows[0];
        };
    

const updateRating = async(contentrating, knowledgerating, overallrating,blog_id,user_id ) =>{

    const values=[ blog_id,contentrating, knowledgerating, overallrating,user_id  ]; 
    const q1 = `Update ratings set contentrating='${contentrating}',knowledgerating =' ${knowledgerating}',overallrating=['${overallrating}'] where blog_id= '${blog_id}'
     AND user_id= '${user_id}' `;
     const query = `
     UPDATE ratings
     SET contentrating = $2, knowledgerating = $3, overallrating = $4
     WHERE blog_id = $1 AND user_id= $5  RETURNING *
   `;
     // const result = await pool.query(query, values);
 let result = await pool.query(query, values);
 if (result.rows.length == 0) {
     const error = new ApolloError('Blog not created', 'BAD_REQUEST');
         error.extensions = { code: 'BAD_REQUEST',statusCode:400 };
         throw error;
 }

   return result.rows[0];
 };
module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    giveRating,
    updateRating
};
