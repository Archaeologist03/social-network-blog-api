const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const feedRoutes = require('./routes/feed');

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// CORS "fix"(bypass)
app.use((req, res, next) => {
  // setHeader doesn't not send response.
  // Only modifies and adds next header.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.use('/feed', feedRoutes);

app.listen(8080);
