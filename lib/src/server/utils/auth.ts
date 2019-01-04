import jwt from 'jsonwebtoken';
import env from '@app/common/config/env';

export const sign = (payload: any) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, env.jwt_secret, { expiresIn: '24h' }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const decode = <T = any>(token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.jwt_secret, (err, decoded: any) => {
      if (err) reject(err);
      resolve(decoded as T);
    });
  });
};
