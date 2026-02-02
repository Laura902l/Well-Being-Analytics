jest.mock('../../middleware/auth.middleware', () => {
  return (req, res, next) => {
    req.user = {};
    next();
  };
});

jest.mock('../../middleware/admin.middleware', () => {
  return (req, res, next) => next();
});

jest.mock('../../models/Survey', () => ({
  findOneAndUpdate: jest.fn()
}));

const request = require('supertest');
const app = require('../../app');

describe('Survey routes – invalid user data in token', () => {
  test('returns 400 when user data in token is invalid', async () => {
    const res = await request(app)
      .post('/api/surveys')
      .send({ surveyId: '1', data: {} });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: 'Invalid user data in token'
    });
  });
});
