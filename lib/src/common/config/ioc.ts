import { Container } from 'inversify';
import constants from './constants';
import EmailService, { IEmailService } from '../services/email';

import { UserRepository, UserRepo } from '@app/data/repositories/user';
import {
  VerificationRepository,
  VerificationRepo,
} from '@app/data/repositories/verification';

// import controllers
import '../../server/controllers';

const container = new Container();

/**
 * Setup container bindings
 */
container.bind<IEmailService>(constants.EmailService).to(EmailService);
container.bind<UserRepo>(constants.UserRepo).to(UserRepository);
container
  .bind<VerificationRepo>(constants.VerificationRepo)
  .to(VerificationRepository);

/**
 * Inversion of control container
 */
export default container;
