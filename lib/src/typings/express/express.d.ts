import jSend from 'jsend';

declare global {
  namespace Express {
    export interface Request {
      user: any;
    }

    export interface Response {
      jSend: jSend;
    }
  }
}
