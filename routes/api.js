'use strict';

const crypto = require('crypto');

// in-memory storage for likes. keys are uppercase stock symbols.
// value = { likes: number, ips: Set<string> }
const stockStore = {};

// helper to anonymize an IP string by hashing it
function anonymizeIp(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        let { stock, like } = req.query;
        if (!stock) {
          return res.status(400).json({ error: 'stock query parameter is required' });
        }

        // normalize query to an array for easier processing
        const symbols = Array.isArray(stock) ? stock : [stock];

        const results = [];

        for (let sym of symbols) {
          const upper = sym.toUpperCase();

          // fetch from the proxy API
          const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${upper}/quote`;
          const fetchRes = await fetch(url);
          const json = await fetchRes.json();

          // price may come as string or number
          const price = Number(json.latestPrice) || 0;

          // initialize store if not present
          if (!stockStore[upper]) {
            stockStore[upper] = { likes: 0, ips: new Set() };
          }

          // handle like
          if (like === 'true' || like === true) {
            const hashedIp = anonymizeIp(req.ip);
            if (!stockStore[upper].ips.has(hashedIp)) {
              stockStore[upper].ips.add(hashedIp);
              stockStore[upper].likes++;
            }
          }

          results.push({ stock: upper, price, likes: stockStore[upper].likes });
        }

        if (results.length === 1) {
          return res.json({ stockData: results[0] });
        }

        // two or more stocks, respond with relative likes for first two
        if (results.length === 2) {
          const rel1 = results[0].likes - results[1].likes;
          const rel2 = results[1].likes - results[0].likes;
          return res.json({ stockData: [
            { stock: results[0].stock, price: results[0].price, rel_likes: rel1 },
            { stock: results[1].stock, price: results[1].price, rel_likes: rel2 }
          ] });
        }

        // if more than two stocks requested, behave like first two
        const rel1 = results[0].likes - results[1].likes;
        const rel2 = results[1].likes - results[0].likes;
        return res.json({ stockData: [
          { stock: results[0].stock, price: results[0].price, rel_likes: rel1 },
          { stock: results[1].stock, price: results[1].price, rel_likes: rel2 }
        ] });

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
};
