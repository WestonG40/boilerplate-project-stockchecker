const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

suite('Functional Tests', function() {
  // store likes count between tests
  let initialLikes;
  let initialLikes = 0;

  test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'GOOG'})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        const sd = res.body.stockData;
        assert.isObject(sd);
        assert.property(sd, 'stock');
        assert.property(sd, 'price');
        assert.property(sd, 'likes');
        assert.isString(sd.stock);
        assert.isNumber(sd.price);
        assert.isNumber(sd.likes);
        initialLikes = sd.likes;
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
      .query({stock: 'GOOG', like: true})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        const sd = res.body.stockData;
        assert.equal(sd.likes, initialLikes + 1);
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
      .query({stock: 'GOOG', like: true})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        const sd = res.body.stockData;
        assert.equal(sd.likes, initialLikes + 1);
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
      .query({stock: ['MSFT', 'AAPL']})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        res.body.stockData.forEach((sd) => {
          assert.property(sd, 'stock');
          assert.property(sd, 'price');
          assert.property(sd, 'rel_likes');
          assert.isString(sd.stock);
          assert.isNumber(sd.price);
          assert.isNumber(sd.rel_likes);
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
      .query({stock: ['MSFT', 'AAPL'], like: true})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        const rel0 = res.body.stockData[0].rel_likes;
        const rel1 = res.body.stockData[1].rel_likes;
        // after liking both with same IP, rel_likes should remain equal/opposite
        assert.isNumber(rel0);
        assert.isNumber(rel1);
        assert.equal(rel0, -rel1);
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
