import { injectable } from 'inversify';
import { BaseRepository } from './base';
import { User } from '../models/user';
import UserSchema from '../schemas/user';
import { Repository } from './utils/contract';

@injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('User', UserSchema);
  }
}

/**
 * User Repository Interface
 */
export interface UserRepo extends Repository<User> {}
