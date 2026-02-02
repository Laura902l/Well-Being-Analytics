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


//   test('returns 403 for non-admin user', async () => {
//     jwt.verify.mockReturnValue({
//       id: '1',
//       username: 'user',
//       role: 'user'
//     })
//     const res = await request(app)
//       .get('/api/surveys/admin')
//       .set('Authorization', 'Bearer token')

//     expect(res.statusCode).toBe(403)
//   })

})
const admin = require('../../middleware/admin.middleware')

describe('admin middleware (unit)', () => {

  test('calls next() for admin user', () => {
    const req = {
      user: { role: 'admin' }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const next = jest.fn()

    admin(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  test('returns 401 for invalid token', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const res = await request(app)
      .get('/api/surveys/admin')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid token');
  });
})
