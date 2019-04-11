const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

mongoose
  .connect(
    'mongodb+srv://ilija:bandera123@cluster0-p7nax.mongodb.net/messages?retryWrites=true',
    { useNewUrlParser: true },
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
