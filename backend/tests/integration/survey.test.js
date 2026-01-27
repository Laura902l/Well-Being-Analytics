beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { })
})

afterAll(() => {
  console.error.mockRestore()
})

jest.mock('../../middleware/auth.middleware', () => {
  return (req, res, next) => {
    req.user = {
      id: 'user123',
      username: 'testuser',
      role: 'user'
    }
    next()
  }
})

jest.mock('../../middleware/admin.middleware', () => {
  return (req, res, next) => next()
})

jest.mock('../../models/Survey')

const request = require('supertest')
const app = require('../../app')
const Survey = require('../../models/Survey')

describe('Survey routes', () => {

  test('saves survey successfully', async () => {
    Survey.findOneAndUpdate.mockResolvedValue({})

    const res = await request(app)
      .post('/api/surveys')
      .send({
        surveyId: '1',
        data: { answer: 5 }
      })

    expect(res.statusCode).toBe(200)
  })

  test('returns 403 when accessing чужие данные', async () => {
    const res = await request(app)
      .get('/api/surveys/anotherUserId')

    expect(res.statusCode).toBe(403)
  })

  test('returns 500 on DB error (admin)', async () => {
    Survey.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('DB failed'))
    })

    const res = await request(app)
      .get('/api/surveys/admin')

    expect(res.statusCode).toBe(500)
  })

  test('admin gets all surveys successfully', async () => {
    Survey.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ surveyId: '1' }])
    })

    const res = await request(app)
      .get('/api/surveys/admin')

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([{ surveyId: '1' }])
  })
  test('user gets own surveys successfully', async () => {
    Survey.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ surveyId: '1' }])
    })

    const res = await request(app)
      .get('/api/surveys/user123')

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([{ surveyId: '1' }])
  })
  test('returns survey saved message explicitly', async () => {
    Survey.findOneAndUpdate.mockResolvedValue({})

    const res = await request(app)
      .post('/api/surveys')
      .send({ surveyId: 'stress', data: {} })

    expect(res.body).toEqual({ message: 'Survey saved' })
  })

})

