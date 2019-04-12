const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  // req.file.path = multer generates path that holds the path on to the file on server
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Ilija' },
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfuly',
        post: result,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  // if image is not changed just use existing img url
  // otherwise set imageUrl to new img path.
  // if neither, throw error;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      //checks if new file(img) is uploaded
      // deletes old one(file) if it is.
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });

  // Post.findByIdAndUpdate(postId, {
  //   title: title,
  //   content: content,
  //   imageUrl: imageUrl,
  // })
  //   .then(post => {
  //     if (!post) {
  //       const error = new Error('Could not find post');
  //       error.statusCode = 404;
  //       throw error;
  //     }
  //     res.status(201).json({ message: 'Post updated', post: post });
  //   })
  //   .catch(err => {
  //     if (!err.statusCode) {
  //       err.status = 500;
  //     }
  //     next(err);
  //   });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      // check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });

  // Post.findByIdAndDelete(postId)
  //   .then(post => {
  //     res.status(204).json({ message: 'Post deleted', post: post });
  //   })
  //   .catch(err => {
  //     if (!err.statusCode) {
  //       err.status = 500;
  //     }
  //     next(err);
  //   });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
