const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

suite('Functional Tests', function() {
  let initialLikes = 0;

  test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG' })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        expect(res.body.stockData).to.have.property('stock', 'GOOG');
        expect(res.body.stockData).to.have.property('price');
        expect(res.body.stockData).to.have.property('likes');
        initialLikes = res.body.stockData.likes;
        done();
      });
  });

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: true })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        expect(res.body.stockData).to.have.property('stock', 'GOOG');
        expect(res.body.stockData).to.have.property('price');
        expect(res.body.stockData).to.have.property('likes');
        expect(res.body.stockData.likes).to.be.at.least(initialLikes);
        initialLikes = res.body.stockData.likes;
        done();
      });
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: true })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        expect(res.body.stockData).to.have.property('stock', 'GOOG');
        expect(res.body.stockData).to.have.property('price');
        expect(res.body.stockData).to.have.property('likes');
        expect(res.body.stockData.likes).to.equal(initialLikes); // Like should not increase
        done();
      });
  });

  test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'] })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        expect(res.body.stockData).to.be.an('array').that.has.length(2);
        res.body.stockData.forEach(stockObj => {
          expect(stockObj).to.have.property('stock');
          expect(stockObj).to.have.property('price');
          expect(stockObj).to.have.property('rel_likes');
        });
        done();
      });
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'], like: true })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        expect(res.body.stockData).to.be.an('array').that.has.length(2);
        res.body.stockData.forEach(stockObj => {
          expect(stockObj).to.have.property('stock');
          expect(stockObj).to.have.property('price');
          expect(stockObj).to.have.property('rel_likes');
        });
        done();
      });
  });
});
