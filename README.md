# Stock Price Checker

This is the boilerplate for the Stock Price Checker project. Instructions for building your project can be found at https://freecodecamp.org/learn/information-security/information-security-projects/stock-price-checker

## Features implemented

- GET `/api/stock-prices` endpoint accepting one or two NASDAQ symbols.
- Optional `like=true` query to record a like from the requesting IP (anonymized via SHA-256).
- Content Security Policy applied with **Helmet** allowing only same-origin scripts and styles.
- In-memory store for likes with per-IP deduplication.
- Functional tests covering all required behaviors.

## Running the project locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server (default port 3000):
   ```bash
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Set the `NODE_ENV` environment variable to `test` before starting the server. This triggers the built-in Mocha test runner used by FreeCodeCamp.

```bash
NODE_ENV=test node server.js
```

Alternatively, you can run the tests directly if you prefer:

```bash
npm install -g mocha
mocha tests/2_functional-tests.js
```

All tests are located in `tests/2_functional-tests.js` and assert the API behaves as specified by the challenge.

> **Note:** likes are stored in memory and will reset when the server restarts. This is acceptable for the purpose of the coding challenge.
