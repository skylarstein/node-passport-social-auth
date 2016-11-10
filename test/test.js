'use strict';

process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../server.js');
const expect   = chai.expect;

chai.use(chaiHttp);

describe('GET /', () => {
  it('it should GET /', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });
});

describe('GET /profile', () => {
  it('it should receive 401 when not logged in', (done) => {
    chai.request(server)
      .get('/profile')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.html;
        done();
      });
  });
});
