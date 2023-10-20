const  pool  = require('../../database/db');

const getBlogById = async (id) => {
    console.log(id)
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
};



const getAllBlogs = async () => {
    const query = `
    SELECT *
    FROM blogs
    LEFT JOIN ratings ON blogs.id = ratings.blog_id
   LEFT JOIN comments ON blogs.id = comments.blog_id
`;
    const { rows } = await pool.query(query);
    return rows; 

};

module.exports = {
    getBlogById,
    getAllBlogs,
};
