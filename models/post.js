const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  // auto add timestamp when new obj is added to db.
  // getting createdAt and updatedAt fields(vars) with it.
  { timestamps: true },
);

module.exports = mongoose.model('Post', postSchema);
