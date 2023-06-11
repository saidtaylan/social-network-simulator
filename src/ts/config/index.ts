import appConfig from './app'
import { connectDB } from './db'
import initSwagger from './swagger'
import type { Express } from 'express';

export default async (app: Express) => {
  appConfig();
  await connectDB();
  initSwagger(app);
};
