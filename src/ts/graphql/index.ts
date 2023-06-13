import type Service from '../service'
import { ApolloServer, BaseContext } from '@apollo/server';

export default class GraphQL {
  constructor(private readonly service: Service, private readonly graphQLServer: ApolloServer<BaseContext>) {

  }
}
