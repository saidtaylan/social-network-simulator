import type { Request, Response, NextFunction } from 'express'
import { IError } from '../interfaces/error';

export default class ErrorHandler {
  handle(err: IError, req: Request, res: Response, next: NextFunction) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const errStatus = err.status || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).send({
      status: errStatus,
      message: errMsg,
    });
  }
}
