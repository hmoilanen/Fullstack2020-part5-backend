const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})

	const blogObjects = helper.initialBlogs
		.map(blog => new Blog(blog))
	const promiseArray = blogObjects.map(blog => blog.save())
	await Promise.all(promiseArray)
})

describe('about blogs', () => {
	test('blogs are returned as json and the amount is correct', async () => {
		const res = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	
		expect(res.body).toHaveLength(helper.initialBlogs.length)
	})

	test('verify the unique identifier of blog being named as id, not _id', async () => {
		const blog = await Blog.findOne({})

		expect(blog.toJSON().id).toBeDefined()
		expect(blog.toJSON()._id).not.toBeDefined()
	})

	test('posting a blog successfully adds one in db', async () => {
		const newBlog = {
			title: 'XXX',
			author: 'YYY',
			url: 'www.xyz.com',
			likes: 420
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')
		const titles = response.body.map(blog => blog.title)

		expect(titles).toHaveLength(helper.initialBlogs.length + 1)
		expect(titles).toContain(newBlog.title)
	})

	test('if blog is missing likes property, it\'ll default to value 0', async () => {
		const newBlogWithoutLikes = {
			title: 'Blog title!',
			author: 'Blog author!',
			url: 'www.blog&author.com'
		}

		expect(newBlogWithoutLikes.likes).not.toBeDefined()

		const hasLikesProperty = (response) => {
			expect(response.body.likes).toBeDefined()
		}

		await api
			.post('/api/blogs')
			.send(newBlogWithoutLikes)
			.expect(201)
			.expect('Content-Type', /application\/json/)
			.expect(hasLikesProperty)
	})

	test('verifying title and author properties are included to the request or 400', async () => {
		const newBlogWithoutTitleAndAuthor = {
			url: 'www.blogurl.com',
			likes: 0
		}
		
		await api
			.post('/api/blogs')
			.send(newBlogWithoutTitleAndAuthor)
			.expect(400)
	})

	test('confirm the blog is successfully deleted from db', async () => {
		const allBlogs = await helper.allBlogsInDb()

		await api
			.del(`/api/blogs/${allBlogs[0].id}`)
			.expect(204)

		const blogsAfterDelete = await helper.allBlogsInDb()

		expect(blogsAfterDelete).toHaveLength(allBlogs.length - 1)

	})

	test('confirm all properties of blog are updated successfully in db', async () => {
		let blogToUpdate = await (await Blog.findOne({ title: helper.initialBlogs[0].title })).toJSON()
		const propertiesToUpdate = {
			title: blogToUpdate.title + '-UPDATED',
			author: blogToUpdate.author + '-UPDATED',
			url: blogToUpdate.url + '-UPDATED',
			likes: blogToUpdate.likes++
		}
		
		const updatedBlog = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(propertiesToUpdate)
			.expect(200)

		for (const key in propertiesToUpdate) {
			expect(updatedBlog.body[key]).toBe(propertiesToUpdate[key])
		}
	})
})

afterAll(() => {
	mongoose.connection.close()
})