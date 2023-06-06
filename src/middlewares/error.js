class ErrorHandler {
  handle(err, req, res, next) {
    const errStatus = err.status || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).send({
      status: errStatus,
      message: errMsg,
    });
  }
}

module.exports = ErrorHandler;
