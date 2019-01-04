import JsendContract from 'jsend';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

class JSendMiddleware implements JsendContract {
  constructor(private readonly res: Response) {}

  success(data: any) {
    this.res.json({
      status: 'success',
      data,
    });
  }

  fail(data: any) {
    this.res.status(HttpStatus.EXPECTATION_FAILED).json({
      status: 'fail',
      data,
    });
  }

  error(data: any, message: string, code: number) {
    const httpCode = code || HttpStatus.INTERNAL_SERVER_ERROR;
    this.res.status(httpCode).json({
      status: 'error',
      data,
      message,
      code: httpCode,
    });
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  res.jSend = new JSendMiddleware(res);
  next();
};
