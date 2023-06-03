const joi = require("joi");

const createUser = joi.object({
  body: {
    username: joi.string().min(6).required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().min(6).required(),
  },
  params: {},
});

const login = joi.object({
  body: {
    email: joi.string().email().min(6).required(),
    password: joi.string().min(6).required(),
  },
  params: {},
});

const createPost = joi.object({
  body: {
    email: joi.string().email().min(6).required(),
    password: joi.string().min(6).required(),
  },
  params: {},
});

const getUser = joi.object({
  body: {},
  params: {
    username: joi.string().min(6).required(),
  },
});

module.exports = {
  createUser,
  login,
  createPost,
  getUser,
};
