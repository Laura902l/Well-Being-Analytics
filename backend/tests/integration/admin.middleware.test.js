const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')

jest.mock('jsonwebtoken')

describe('Admin middleware', () => {
  test('returns 403 for non-admin user', async () => {
    jwt.verify.mockReturnValue({
      id: '1',
      username: 'user',
      role: 'user'
    })

    const res = await request(app)
      .get('/api/surveys/admin')
      .set('Authorization', 'Bearer token')

    expect(res.statusCode).toBe(403)
  })
})
