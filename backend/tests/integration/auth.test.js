const request = require('supertest')
const app = require('../../app');
const User = require('../../models/User')

jest.mock('../../models/User')

describe('Auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('registers user successfully', async () => {
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue({})

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'test',
        fullname: 'Test User',
        password: '123456'
      })

    expect(res.statusCode).toBe(200)
  })

  test('fails if user exists', async () => {
    User.findOne.mockResolvedValue({})

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'test',
        fullname: 'Test User',
        password: '123456'
      })

    expect(res.statusCode).toBe(400)
  })

  test('login fails with wrong username', async () => {
    User.findOne.mockResolvedValue(null)

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wrong',
        password: '123'
      })

    expect(res.statusCode).toBe(401)
  })
  test('login returns 500 on server error', async () => {
    User.findOne.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: '123' });

    expect(res.statusCode).toBe(500);
  });

  test('login fails when password is incorrect', async () => {
    User.findOne.mockResolvedValue({
      _id: '1',
      username: 'test',
      password: 'hashed'
    });

    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test',
        password: 'wrong-password'
      });

    expect(res.statusCode).toBe(401);
  });


})
