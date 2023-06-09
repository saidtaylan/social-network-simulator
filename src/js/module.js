const Controller = require('./controller');
const Service = require('./service');
const Authentication = require('./middlewares/authentication');
const Validation = require('./middlewares/validation');
const ErrorHandler = require('./middlewares/error');

const service = new Service();
const middlewares = {
  authentication: new Authentication(),
  validation: new Validation(),
  errorHandler: new ErrorHandler(),
};
const controller = new Controller(service, middlewares.authentication, middlewares.validation);

module.exports = {
  controller,
  service,
  middlewares,
};
