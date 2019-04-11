exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: 'First post',
        content: 'This is the first post!',
        imageUrl: 'images/screenshot.png',
        creator: {
          name: 'Ilija',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  // Create post in db
  res.status(201).json({
    message: 'Post created successfuly',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'Ilija' },
      createdAt: new Date(),
    },
  });
};
