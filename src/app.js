const express = require('express');
const helmet = require('helmet');
const config = require('./config/index');
const { controller, middlewares } = require('./module');

const app = express();

config(app);

app.use(express.json());
app.use(helmet());

const startApp = (APP_PORT) => {
  app.listen(APP_PORT, () => {
    console.log('APP_PRTta başladı', APP_PORT);
    app.use('/', controller.setRouter());
    app.use(middlewares.errorHandler.handle);
  });
};

module.exports = startApp;
