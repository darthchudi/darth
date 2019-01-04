import { Model } from '.';

export interface User extends Model {
  email: string;
  is_verified: boolean;
  password: string;
  phone_number: string;
  isValidPassword: (plainText: string) => Promise<Boolean>;
}

/**
 * Data Transfer Object describing User login payload
 */
export interface LoginDTO {
  email: string;
  password: string;
}
