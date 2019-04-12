const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/post');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      // Custom validator that checks if email exists in DB.
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email address already exists.');
          }
        });
      })
      .normalizeEmail(),
    body('password').isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty(),
  ],
  authController.signup,
);

module.exports = router;