const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

// Configuring Chai to use chai http middleware to test express http routes
chai.use(chaiHttp);

// Configureing Chai to support should assertions
chai.should();

describe('ROUTE: /translate', function () {
  context('PATH: GET /translate', function () {
    it('should get language code and language for the specifed text', function (done) {
      // Testing the route with headers
      chai.request(app)
        .get('/translate')
        .set('Content-Type', 'application/json')
        .send({ text: 'Hello World!' })
        .end(function (err, res) {
          // Response should have status 200
          res.should.have.status(200);

          // And body should have request_id
          res.body.should.be.a('object')
            .and.have.property('language');
          // And body should have request_id
          res.body.should.be.a('object')
            .and.have.property('languageCode');

          done(err);
        });
    });
    it('should not get language Info for the specifed text as the language is not supported by the system',
      function (done) {
        // Testing the route with headers
        chai.request(app)
          .get(`/translate`)
          .set('Content-Type', 'application/json')
          .send({ text: 'Барлығына сәлем, менің атым Пуал. Мен Үндістаннанмын.' })
          .end(function (err, res) {
            // Response should have status 400
            res.should.have.status(400);

            // response should be an object
            res.body.should.be.a('object');

            // And body should have errorCode and errorMessage
            res.body.should.have.property('errorCode').equals(400)
            res.body.should.have.property('errorMessage').equals('Specified language is not supported')

            done(err);
          });
      });
  });

  context('PATH: POST /translate', function () {
    it('should translate the text to the specified language', function (done) {
      // Testing the route with headers
      chai.request(app)
        .post('/translate?lan=kn')
        .set('Content-Type', 'application/json')
        .send({ text: 'Hello World!' })
        .end(function (err, res) {
          // Response should have status 200
          res.should.have.status(200);

          // And body should have request_id
          res.body.should.be.a('object').have.property('translation')

          done(err);
        });
    });
    it('should not translate the text to the specified language due to invalid language code', function (done) {
      // Testing the route with headers
      chai.request(app)
        .post('/translate?lan=cm')
        .set('Content-Type', 'application/json')
        .send({ text: 'Hello World!' })
        .end(function (err, res) {
          // Response should have status 400
          res.should.have.status(400);

          // response should be an object
          res.body.should.be.a('object');

          // And body should have errorCode and errorMessage
          res.body.should.have.property('errorCode').equals(400)
          res.body.should.have.property('errorMessage').equals('Invalid language code: cm')

          done(err);
        });
    });
  });
});
