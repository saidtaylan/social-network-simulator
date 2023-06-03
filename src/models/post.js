const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],

    retweet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],

    deleted_at: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('post', postSchema);
