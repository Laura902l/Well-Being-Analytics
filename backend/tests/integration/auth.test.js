const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../../app');
const User = require('../../models/User');

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../../models/User');

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

  test('login succeeds with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('123', 10);

    User.findOne.mockResolvedValue({
      _id: 'user123',
      username: 'testuser',
      password: hashedPassword,
      role: 'user'
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked-token');

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: '123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      token: 'mocked-token',
      role: 'user',
      username: 'testuser',
      userId: 'user123'
    });
  });

})
describe('Check username', () => {

  test('returns exists=true when username already exists', async () => {
    User.exists.mockResolvedValue(true);

    const res = await request(app)
      .get('/api/auth/check-username/testuser');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ exists: true });
  });

  test('returns exists=false when username does not exist', async () => {
    User.exists.mockResolvedValue(false);

    const res = await request(app)
      .get('/api/auth/check-username/newuser');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ exists: false });
  });

});
