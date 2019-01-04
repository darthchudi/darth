import joi from 'joi';

export const login = joi.object({
  email: joi
    .string()
    .email()
    .trim()
    .required(),
  password: joi
    .string()
    .trim()
    .required(),
});
