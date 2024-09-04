/* eslint-disable no-undef */
const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) =>{
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  }

  const totalblogs = (blogs) =>{
    return blogs.length;
  }
  
  module.exports = {
    dummy,
    totalLikes,
    totalblogs
  }