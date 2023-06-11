import express from 'express'
import helmet from 'helmet'
import config from './config'

import { controller, middlewares } from './module'
//const graphqlMiddleware = require('./graphql');



const startApp = (APP_PORT: number) => {
    const app = express();
    config(app);
    app.use(express.json());
    app.use(
        helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }),
    );
    app.listen(APP_PORT, () => {
        console.log('App started at port:', APP_PORT);
        app.use('/rest', controller.setRouter());
        //app.use('/graphql', graphqlMiddleware);
        app.use(middlewares.errorHandler.handle);
    });
};

export default startApp