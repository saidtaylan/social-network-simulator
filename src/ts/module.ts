import Controller from './controller';
import Service from './service';
import Authentication from './middlewares/authentication';
import Validation from './middlewares/validation'
import ErrorHandler from './middlewares/error'

export const service = new Service();
export const middlewares = {
  authentication: new Authentication(),
  validation: new Validation(),
  errorHandler: new ErrorHandler(),
};
export const controller = new Controller(service, middlewares.authentication, middlewares.validation);
