import MainController from './controller';
import MainService from './service';
import Authentication from './middlewares/authentication';
import Validation from './middlewares/validation'
import ErrorHandler from './middlewares/error'
import { Router, type Express } from 'express'
import { RouteDefinition } from './interfaces/routes';

class MainModule {
  private services!: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any 
  private middlewares!: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any 
  private controllers!: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any 

  constructor(private readonly app: Express) {
    this.initializeClasses()
    this.registerControllers()
  }

  initializeClasses() {
    this.services = {
      MainService: new MainService()
    }
    this.middlewares = {
      Authentication: new Authentication(),
      Validation: new Validation(),
      ErrorHandler: new ErrorHandler(),
    };

    this.controllers = {
      MainController: new MainController(this.services.MainService, this.middlewares.authentication, this.middlewares.validation),
    }
  }

  registerControllers() {
    const router = Router()
    for (const controller in this.controllers) {
      const ctrl = this.controllers[controller]
      const routes: RouteDefinition[] = Reflect.getMetadata('routes', ctrl.constructor)
      const prefix: string = Reflect.getMetadata('prefix', ctrl.constructor)
      routes.forEach((route: RouteDefinition) => {
        router[route.reqMethod](`${prefix}/${route.path}`, ...route.methods.map((method: string) => ctrl[method].bind(ctrl)))
      })
    }
    this.app.use(router)
  }

  useMiddleware(middleware: string) {
    return this.middlewares[middleware]
  }
}

export default MainModule
