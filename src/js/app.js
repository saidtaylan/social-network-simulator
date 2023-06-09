const express = require('express');
const helmet = require('helmet');
const config = require('./config/index');
const { controller, middlewares } = require('./module');
const graphqlMiddleware = require('./graphql');

const app = express();

config(app);

app.use(express.json());
app.use(
  helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }),
);

const startApp = (APP_PORT) => {
  app.listen(APP_PORT, () => {
    console.log('APP_PRTta başladı', APP_PORT);
    app.use('/api', controller.setRouter());
    app.use('/graphql', graphqlMiddleware);
    app.use(middlewares.errorHandler.handle);
  });
};

module.exports = startApp;
