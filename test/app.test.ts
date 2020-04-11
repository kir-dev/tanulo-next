import request from 'supertest'
import app from '../src/app'

describe('GET /', () => {
  it('should redirect to /rooms', done => {
    request(app).get('/')
      .expect('Location', /\/rooms/, done)
  })
})

describe('GET /random-url', () => {
  it('should render Not Found page', done => {
    request(app).get('/random-url')
      .expect(200, done)
  })
})
