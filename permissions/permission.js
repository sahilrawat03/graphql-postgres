// permissions.js
const { rule, and, or, not } = require('graphql-shield');

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const isAdmin = rule()((parent, args, { user }) => {
  return user && user.role === 'admin';
});

const isBlogOwner = rule()(async (parent, args, { user, db }, info) => {
  const blogId = args.id;
  const blog = await db.getBlogById(blogId);

  return blog && blog.authorId === user.id;
});

module.exports = {
  isAuthenticated,
  isAdmin,
  isBlogOwner,
};
