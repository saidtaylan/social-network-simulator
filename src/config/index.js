const appConfig = require("./app.js");
const db = require("./db.js");
const initSwagger = require("./swagger.js");

module.exports = async (app) => {
  appConfig();
  await db.connectDB();
  initSwagger(app);
};
