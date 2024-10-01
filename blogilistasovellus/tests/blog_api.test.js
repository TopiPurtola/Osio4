const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const testhelper = require('./testhelper')

const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(testhelper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(testhelper.initialBlogs[1])
    await blogObject.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('right ammount of blogs', async() =>{
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
  })

  test('id field is id not _id', async() =>{
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id,undefined)
    })
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'Toimi',
        author: 'meitsi',
        url: 'joovaikkaemt.com',
        likes: 832
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
  
    assert.strictEqual(response.body.length, testhelper.initialBlogs.length + 1)
  
    assert(titles.includes('Toimi'))
  })

  test('a blog can be removed'), async () => {
    const blogsAtStart = testhelper.initialBlogs
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/notes/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await testhelper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, testhelper.initialBlogs.length -1)
        
    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(blogToDelete.title))    
  }


  after(async() =>{
    await mongoose.connection.close()
  })