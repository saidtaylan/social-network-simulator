const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate({
    body: req.body,
    params: req.params,
  });
  if (error) {
    // joi, içinde obje şeklinde hataların bulunduğu bir details dizisi geri döner. Buradaki hata mesajlarını alıp bir diziye atıyoruz
    //error.details = [{message: 'name bust be a string'}]
    const errorMessage = error.details?.map((item) => item.message);
    res.status(400).send({ message: errorMessage });
    return;
  }
  Object.assign(req.body, value.body);
  Object.assign(req.params, value.params);
  return next();
};

module.exports = validate;
