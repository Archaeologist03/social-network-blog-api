const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get Authorization header from req
  // Check if header exists, if not throw err
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  // If header does exist(passes prev if check)
  // split it up ('Bearer <token>') and get just token([1])
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    // decode and verify, validate the token.
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  // if undefined = didnt failed but wasnt able to verify token.
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  // We got valid token.
  req.userId = decodedToken.userId;
  next();
};
