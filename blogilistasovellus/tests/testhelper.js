const Blog = require('../models/blog')

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}