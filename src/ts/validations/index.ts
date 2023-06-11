import joi from 'joi'

export const createUser = joi.object({
  body: {
    username: joi.string().min(6).required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().min(6).required(),
  },
  params: {},
});

export const login = joi.object({
  body: {
    email: joi.string().email().min(6).required(),
    password: joi.string().min(6).required(),
  },
  params: {},
});

export const createPost = joi.object({
  body: {
    content: joi.string().min(10).required(),
  },
  params: {},
});

export const getUser = joi.object({
  body: {},
  params: {
    username: joi.string().min(6).required(),
  },
});
