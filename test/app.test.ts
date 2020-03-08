import request from 'supertest'
import app from '../src/app'

describe('GET /random-url', () => {
  it('should render Not Found page', (done) => {
    request(app).get('/random-url')
      .expect(200, done)
  })
})
