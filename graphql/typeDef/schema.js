const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
type Blog {
  id: Int
  title: String
  content: String
  tags:[String]
  knowledgerating: Int
  overallrating: Int
  user_id:Int
  contentrating:Int
  usercomments:[String]
}
type Rating {
  id: Int
  contentrating: Int
  knowledgerating: Int
  overallrating: Int
  blog_id:Int
  user_id:Int
}

type Query {
  getBlogById(id: Int!): Blog
  getBlogs:[Blog]
}

type Mutation {
  createBlog( title: String  content: String  points:Int tags:[String] ): Blog

  updateBlog(id:Int,title: String  content: String  points:Int tags:[String] ):Blog

  deleteBlog(id:Int   ):Blog

  giveRating(
    contentrating: Int
    knowledgerating: Int
    overallrating: Int
    blog_id:Int
    user_id:Int ): Rating

  updateRating(id: Int
    contentrating: Int
    knowledgerating: Int
    overallrating: Int
    blog_id:Int
    user_id:Int ):Rating

  deleteRating(id: Int
    blog_id:Int
    user_id:Int  ):Rating

}
`;
