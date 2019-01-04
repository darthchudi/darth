import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  requestBody,
  response,
  httpGet,
  queryParam,
} from 'inversify-express-utils';

import constants from '@app/common/config/constants';
import { LoginDTO } from '@app/data/models/user';
import { UserRepo } from '@app/data/repositories/user';
import { VerificationRepo } from '@app/data/repositories/verification';

import BaseController from './base';
import * as JWT from '../utils/auth';
import { login } from '../validators/user';
import Validator from '../middlewares/validator';

@controller('/user')
export default class UserController extends BaseController {
  @inject(constants.UserRepo)
  private userRepo: UserRepo;
  @inject(constants.VerificationRepo)
  private verificationRepo: VerificationRepo;

  @httpPost('/login', Validator(login))
  async login(@response() res: Response, @requestBody() body: LoginDTO) {
    try {
      const user = await this.userRepo.byQuery(
        {
          email: body.email,
        },
        '+password',
      );
      await user.isValidPassword(body.password);
      const token = await JWT.sign(user.toJSON());
      this.handleSuccess(res, { token });
    } catch (err) {
      this.handleError(res, err);
    }
  }

  @httpGet('/verification')
  async get(
    @response() res: Response,
    @queryParam('email') email: string,
    @queryParam('token') token: string,
  ) {
    try {
      if (!email || !token) throw new Error('Invalid verification URL');

      const user = await this.userRepo.byQuery({ email });
      if (user.is_verified) throw new Error('User is already verified');

      const foundToken = await this.verificationRepo.byQuery({ token });
      user.is_verified = true;
      await user.save();

      // delete the token
      await await foundToken.remove();

      this.handleSuccess(res, { message: 'Successfully verified user' });
    } catch (err) {
      this.handleError(res, err);
    }
  }
}
