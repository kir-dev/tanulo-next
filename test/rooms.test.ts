import request from 'supertest'
import app from '../src/app'

describe('Rooms', () => {
  describe('GET /rooms/:id', () => {
    it('should render room calendar page', done => {
      request(app).get('/rooms/13')
        .expect(200, done)
    })
  })
})
