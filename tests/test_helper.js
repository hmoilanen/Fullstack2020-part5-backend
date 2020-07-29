const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5
	},
	{
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12
	}
]

const allBlogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const invalidUsers = [
	{
		username: 'Too Short Password',
		name: 'TSP',
		password: 'ab'
	},
	{
		username: 'OP',
		name: 'TSU',
		password: 'tooShortUsername'
	}
]

const allUsersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}

module.exports = {
	initialBlogs,
	allBlogsInDb,
	invalidUsers,
	allUsersInDb
}

/* const dummy = (blogs) => {
	console.log('dummy - blogs:', blogs)
	return 1
} */

/* const totalLikes = (blogs) => {
	//console.log('totalLikes - blogs:', blogs)
	const likes = blogs.map(blog => blog.likes)
	const sumOfLikes = (sum, added) => {
		return sum + added
	}

	return likes.reduce(sumOfLikes, 0)
} */

/* const favouriteBlog = (blogs) => {
	const compareLikes = (prev, current) => {
		if (current.likes > prev.likes) {
			return current
		} else {
			return prev
		}
	}

	return blogs.reduce(compareLikes)
} */

/* module.exports = {
	dummy,
	totalLikes,
	favouriteBlog
} */