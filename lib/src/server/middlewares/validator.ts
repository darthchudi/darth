import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import joi, { ValidationError, AnySchema } from 'joi';

const parseError = (error: ValidationError) => {
  const parsedError = error.details.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.context.key]: curr.message,
    }),
    {}
  );
  return parsedError;
};

const validate = (data: any, schema: joi.AnySchema) => {
  const { error, value } = joi.validate(data, schema, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (!error)
    return {
      err: null,
      value: value,
    };

  return {
    err: parseError(error),
    value: null,
  };
};

export default (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { err, value } = validate(req.body, schema);

    if (!err) {
      req.body = value;
      return next();
    }

    //log error
    return res.jSend.error(
      err,
      'One or more validation errors occured',
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  };
};
