const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
    },
    password: String,
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    deleted_at: Date,
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
