const express = require('express');
const helmet = require('helmet');
const Controller = require('./controller');
const config = require('./config/index');
const errorHandler = require('./middlewares/error');
const Service = require('./service');
const Authentication = require('./middlewares/authentication');
const Validation = require('./middlewares/validation');
const ErrorHandler = require('./middlewares/error');

const app = express();

config(app);

app.use(express.json());
app.use(helmet());

app.listen(process.env.APP_PORT, () => {
  const service = new Service();
  const middlewares = {
    authentication: new Authentication(),
    validation: new Validation(),
    errorHandler: new ErrorHandler(),
  };
  const controller = new Controller(service, middlewares.authentication, middlewares.validation);
  app.use('/', controller.setRouter());
  app.use(middlewares.errorHandler.handle);
});
