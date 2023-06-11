import httpStatus from 'http-status';
import JWT from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import { JwtUserPayload } from '../interfaces/auth';

export default class Authentication {
  authenticate(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.headers?.authorization?.split(' ')[1];
    if (!token) {
      next({ status: httpStatus.UNAUTHORIZED, message: 'token is not valid' });
    }
    JWT.verify(token as string, process.env.ACCESS_TOKEN_SECRET_KEY as string, (error, user) => {
      if (error) {
        next({ status: httpStatus.FORBIDDEN, message: error.message });
      }
      req.user = user as JwtUserPayload;
      next();
    });
  }
}
