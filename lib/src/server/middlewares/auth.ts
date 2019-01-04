import httpStatus from 'http-status-codes';
import * as JWT from '../utils/auth';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization)
      throw new Error('Missing authorization header in request.');
    const token = req.headers.authorization.split(' ')[1];
    req.user = await JWT.decode(token);
    next();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: 'error',
      data: null,
      message: err.message,
      code: httpStatus.UNAUTHORIZED,
    });
  }
};
