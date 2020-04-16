import request from 'supertest'
import app from '../src/app'

describe('Groups', () => {
  describe('GET /groups', () => {
    it('should render groups page', done => {
      const agent = request.agent(app)

      agent.get('/groups')
        .expect(200, done)
    })
  })

  describe('GET /groups/new', () => {
    it('should render new group page', done => {
      const agent = request.agent(app)

      agent.get('/groups/new')
        .expect(200, done)
    })
  })
})
