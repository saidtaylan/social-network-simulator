const express = require('express');
const helmet = require('helmet');
/* const config = require('./config');
const loaders = require('./loaders'); */
const routes = require('./routes');
const config = require('./config/index');
const errorHandler = require('./middlewares/error');

const app = express();

config(app);

app.use(express.json());
app.use(helmet());

app.listen(process.env.APP_PORT, () => {
  app.use('/', routes);
  app.use(errorHandler);
});
