
var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      //LIKES result wont be tested since it will keep increasing when different ips like it
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.body.stock,'GOOG');
          assert.equal(res.status,200);
        });
        done();
      });

      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.stock,'GOOG');
        })
        done();
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.stock,'GOOG');
        })
        done();
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog','msft']})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.stockData[0].stock,'GOOG');
          assert.equal(res.body.stockData[1].stock,'MSFT');
        })
        done();
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog','msft'],like: true})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.stockData[0].stock,'GOOG');
          assert.equal(res.body.stockData[1].stock,'MSFT');
        })
        done();
      });
      
    });

});
