import express from 'express'
import helmet from 'helmet'
import config from './config'
import MainModule from './module'
import { clusterify } from './utils/server'
//const graphqlMiddleware = require('./graphql');

const startApp = (APP_PORT: number) => {
    const app = express();
    config(app);
    app.use(helmet())
    app.use(express.json());
    /*     app.use(
            helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }),
        ); */
    app.listen(APP_PORT, () => {
        const module = new MainModule(app)
        app.use(module.useMiddleware('ErrorHandler').handle())

        //app.use('/graphql', graphqlMiddleware);
    });
};

startApp(3000)
clusterify(startApp, 3000)