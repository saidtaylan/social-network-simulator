const createVal_idation = joi.object({
  body: {
    content: joi.string().min(1).required(),
  },
  params: {},
});
