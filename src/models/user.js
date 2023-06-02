const mongoose = require("mongoose");
//const logger = require("../logs/Users");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    deleted_at: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("user", userSchema);
