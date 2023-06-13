import MainService from './service';
import Authentication from './middlewares/authentication';
import Validation from './middlewares/validation'
import ErrorHandler from './middlewares/error'

import { RouteDefinition } from './interfaces/routes';
import { GraphQLResolvers, GraphQLDecoratorResolvers } from './interfaces/graphql'

class MainModule {
  private services!: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any 
  private middlewares!: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any 

  constructor() {
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
  }

  async registerGraphQL() {
    const resolverClass = (await import('./graphql/resolver')).default
    const resolversMetadata: GraphQLDecoratorResolvers = Reflect.getMetadata('resolvers', resolverClass.prototype.constructor)
    const resolvers: GraphQLResolvers = { Query: {}, Mutation: {} }
    for (const q of resolversMetadata.Query) {
      resolvers.Query[q] = Object.getOwnPropertyDescriptor(resolverClass.prototype, q)?.value
    }
    for (const q of resolversMetadata.Mutation) {
      resolvers.Mutation[q] = Object.getOwnPropertyDescriptor(resolverClass.prototype, q)?.value
    }
    const server = new (await import('@apollo/server')).ApolloServer({
      typeDefs: (await import('./graphql/schema')).default,
      resolvers: resolvers as any, // eslint-disable-line @typescript-eslint/no-explicit-any 
      introspection: true,
    });
    await server.start()
    return (await import('@apollo/server/express4')).expressMiddleware(server)
  }

  async registerControllers(rootPrefix?: string) {
    const controllers: Record<string, any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
      MainController: new (await import('./controller')).default(this.services.MainService, this.middlewares.authentication, this.middlewares.validation),
    }
    const router = (await import('express')).Router()
    for (const controller in controllers) {
      const ctrl = controllers[controller]
      const routes: RouteDefinition[] = Reflect.getMetadata('routes', ctrl.constructor)
      const prefix: string = Reflect.getMetadata('prefix', ctrl.constructor)
      routes.forEach((route: RouteDefinition) => {
        router[route.reqMethod](`${rootPrefix}${prefix}/${route.path}`, ...route.methods.map((method: string) => ctrl[method].bind(ctrl)))
      })
    }
    router.stack.forEach((r) => {
      console.log('r.route', r.route)
    })
    return router
  }

  useMiddleware(middleware: string) {
    return this.middlewares[middleware]
  }
}

export default MainModule
