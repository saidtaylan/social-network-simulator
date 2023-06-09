const appConfig = require('./app');
const db = require('./db');
const initSwagger = require('./swagger');

module.exports = async (app) => {
  appConfig();
  await db.connectDB();
  initSwagger(app);
};
