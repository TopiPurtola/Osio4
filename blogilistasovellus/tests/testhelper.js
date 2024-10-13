const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
    title: 'Spongebob Squigglepants',
    author: 'NintendoDS',
    url: 'sponke.fi',
    likes: 467,
    },
    {
    title: 'Käräjät Kehäkivillä',
    author: 'hassu taulu',
    url: 'seinätaulut.fi',
    likes: 353,
    },
]


const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
  }

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }

module.exports = {
    initialBlogs, blogsInDb, usersInDb, nonExistingId
}