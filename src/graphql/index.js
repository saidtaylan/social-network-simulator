const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const Resolver = require('./resolver');
const Service = require('../service');

const graphqlMiddleware = graphqlHTTP({
  schema,
  rootValue: new Resolver(new Service()).list(),
  graphiql: true,
});

module.exports = graphqlMiddleware;
