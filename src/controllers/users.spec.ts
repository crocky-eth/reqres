import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../index'

const expect = chai.expect

const userID = 1
const noUser = 23

chai.use(chaiHttp)

describe('Users', () => {
  describe('Get User', () => {
    it(`Should get User with ${userID}`, (done) => {
      chai.request(server)
        .get(`/api/users/${userID}`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(err).to.equal(null)
          expect(res.body).to.be.a('object')
          expect(res.body.success).to.equal(true)
          expect(res.body.data.id).to.equal(userID)
          done()
        })
    })

    it(`Should get Error`, (done) => {
      chai.request(server)
        .get(`/api/users/${noUser}`)
        .end((err, res) => {
          expect(res.status).to.equal(403)
          expect(err).to.equal(null)
          expect(res.body).to.be.a('object')
          expect(res.body.success).to.equal(false)
          expect(res.body.message).to.equal('No Data with provided id')
          done()
        })
    })
  })

  describe('Get User Avatar', () => {
    it(`Should get image with ${userID}`, (done) => {
      chai.request(server)
        .get(`/api/users/${userID}/avatar`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(err).to.equal(null)
          expect(res.body).to.be.a('object')
          expect(res.body.success).to.equal(true)
          expect(res.body.data).to.be.a('string')
          done()
        })
    })

    it(`Should get Error`, (done) => {
      chai.request(server)
        .get(`/api/users/${noUser}/avatar`)
        .end((err, res) => {
          expect(res.status).to.equal(403)
          expect(err).to.equal(null)
          expect(res.body).to.be.a('object')
          expect(res.body.success).to.equal(false)
          expect(res.body.message).to.equal('No Data with provided id')
          done()
        })
    })
  })
})