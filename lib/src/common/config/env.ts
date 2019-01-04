import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment config object
 */
export default {
  env: process.env.NODE_ENV || 'development',
  mailgun_api_key: process.env.MAILGUN_API_KEY,
  mailgun_domain: process.env.MAILGUN_DOMAIN,
  mailgun_email: process.env.MAILGUN_EMAIL,
  mongodb_uri: process.env.MONGODB_URL,
  port: Number(process.env.PORT) || 5006,
  salt_rounds: process.env.SALT_ROUNDS || 10,
  jwt_secret: process.env.JWT_SECRET,
};
