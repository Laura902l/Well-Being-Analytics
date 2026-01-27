const request = require('supertest')
const app = require('../../app')

describe('Auth middleware', () => {
  test('returns 401 if no token provided', async () => {
    const res = await request(app)
      .get('/api/surveys/user123')

    expect(res.statusCode).toBe(401)
  })
  test('auth middleware rejects invalid token format', async () => {
    const res = await request(app)
      .get('/api/surveys/admin')
      .set('Authorization', 'InvalidHeader');

    expect(res.statusCode).toBe(401);
  });

})
