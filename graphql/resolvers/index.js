const queryResolvers = require('./query');
const queryMutator = require('./mutation');


exports.resolvers = {
    Query: {
        getBlogById: async (_, { id })=> queryResolvers.getBlogById(id),
        getBlogs: async() => queryResolvers.getAllBlogs(),
    },
    Mutation: {
  
      createBlog: (_, { title, content, tags }, context) => {
        const { user } = context;
        return queryMutator.createBlog(title, content, tags, user.id);
      },
      
      updateBlog: async (_, { id, title, content, tags }, context) => {
        const { user } = context;
        return queryMutator.updateBlog(id,title, content, tags, user.id);
      },
      
      deleteBlog: async (_, { id }) => queryMutator.deleteBlog(id),
        
      giveRating: (_, { contentrating, knowledgerating, overallrating,blog_id }, context) => {
        const { user } = context;
        return queryMutator.giveRating(contentrating, knowledgerating, overallrating,blog_id,user.id);
      },
      
      updateRating: async (_, {contentrating, knowledgerating, overallrating,blog_id }, context) => {
        const { user } = context;
        return queryMutator.updateRating(contentrating, knowledgerating, overallrating,blog_id, user.id);
      },
      
      deleteRating: async (_, {id}) =>   queryMutator.deleteBlog(id),
    },
  };