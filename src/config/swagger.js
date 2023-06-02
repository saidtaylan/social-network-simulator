const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const paths = require("../utils/docs/index.json");

const initSwagger = (app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Social Network Simulator made with ExpressJS",
        version: "0.1.0",
        description:
          "This is a social network simulator made with ExpressJS that people can follow each other and publish posts",
        license: {
          name: "MIT",
          url: "",
        },
        contact: {
          name: "Muhammed Said Taylan",
          url: "https://github.com/saidtaylan/social-network-simulator",
          email: "saidimtaylan@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      paths: {
        ...paths,
      },
    },
    apis: ["../routes.js"],
  };

  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = initSwagger;
