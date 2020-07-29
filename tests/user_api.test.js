const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
	await User.deleteMany({})

	const passwordHash = await bcrypt.hash('sekret', 10)
	const user = new User({ username: 'Robinson Crusoe', passwordHash })

	await user.save()
})

describe('about users', () => {
	test('check that invalid users are not added in db', async () => {
		const invalidUsers = helper.invalidUsers

		for (const user in invalidUsers) {
			await api
				.post('/api/users')
				.send(invalidUsers[user])
				.expect(400)
		}

		const allUsers = await helper.allUsersInDb()

		expect(allUsers).toHaveLength(1) // see: beforeEach()
	})
})

afterAll(() => {
	mongoose.connection.close()
})