import express from 'express'
import helmet from 'helmet'
import config from './config'
import MainModule from './module'
import cors from 'cors'
//import { clusterify } from './utils/server'

const startApp = (APP_PORT: number) => {
    const app = express();
    config(app);
    app.use(cors({ origin: '*' }))
    app.use(express.json());
    app.use(
        helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }),
    );
    app.listen(APP_PORT, async () => {
        const module = new MainModule()
        app.use(await module.registerControllers('/api'))
        app.use('/graphql', await module.registerGraphQL())
        app.use(module.useMiddleware('ErrorHandler').handle)

    });
};

startApp(3000)
//clusterify(startApp, 3000)