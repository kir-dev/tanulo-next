import request from 'supertest'
import app from '../src/app'

describe('Tickets', () => {
  describe('GET /tickets', () => {
    it('should render tickets page', done => {
      const agent = request.agent(app)

      agent.get('/tickets')
        .expect(200, done)
    })
  })

  describe('GET /tickets/new', () => {
    it('should render new ticket page', done => {
      const agent = request.agent(app)

      agent.get('/tickets/new')
        .expect(200, done)
    })
  })
})
