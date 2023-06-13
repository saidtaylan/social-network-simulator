/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import { GraphQLDecoratorResolvers } from '../interfaces/graphql'

export function Resolve(type: 'Query' | 'Mutation') {
    return function (target: any, key: string, method: PropertyDescriptor) {
        let resolvers: GraphQLDecoratorResolvers = { Query: [], Mutation: [] }
        if (!Reflect.hasMetadata('resolvers', target.constructor))
            Reflect.defineMetadata('resolvers', { Query: [], Mutation: [] }, target.constructor)
        resolvers = Reflect.getMetadata('resolvers', target.constructor)
        resolvers[type].push(key)
        Reflect.defineMetadata('resolvers', resolvers, target.constructor)
        return target
    }
}
