const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
	try {
		const users = await User.find({})
			.populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
		response.json(users)
	} catch(exception) {
		next(exception)
	}
})

/* usersRouter.delete('/', async (request, response, next) => {
	try {
		await User.deleteMany({})
		response.status(204)
	} catch(exception) {
		next(exception)
	}
}) */

usersRouter.post('/', async (request, response, next) => {
	const body = request.body

	if (body.username.length >= 3 && body.password.length >= 3) {
		const saltRounds = 10 // don't ask :)
		const passwordHash = await bcrypt.hash(body.password, saltRounds)
		
		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash
		})

		const savedUser = await user.save()

		response.json(savedUser)
	} else {
		response.status(400)
		next({
			message: 'Username and password must be at least 3 characters long!',
			name: 'ValidationError'
		})
	}
})

module.exports = usersRouter