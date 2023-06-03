const errorHandler = (err, req, res) => {
  console.log('Middleware Error Handling');

  const errStatus = err.status || 500;
  const errMsg = err.message || 'Something went wrong';

  res.status(errStatus).send({
    status: errStatus,
    message: errMsg,
  });
};

module.exports = errorHandler;
