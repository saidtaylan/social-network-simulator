import type { Request, Response, NextFunction } from 'express'

export default class ErrorHandler {
  handle(err: any, req: Request, res: Response, next: NextFunction) {
    const errStatus = err.status || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).send({
      status: errStatus,
      message: errMsg,
    });
  }
}
