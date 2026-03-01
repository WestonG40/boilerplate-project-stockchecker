const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // store likes count between tests
  let initialLikes;

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

});
