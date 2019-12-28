import request from 'supertest'
import app from '../src/app'

describe('GET /login', () => {
  it('should return 200 OK', () => {
    return request(app).get('/login')
      .expect(200)
  })
})

