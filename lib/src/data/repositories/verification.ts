import { injectable, inject } from 'inversify';
import { BaseRepository } from './base';
import { Verification } from '../models/verification';
import VerificationSchema from '../schemas/verification';
import { Repository } from './utils/contract';
import { User } from '../models/user';
import constants from '@app/common/config/constants';
import { IEmailService } from '@app/common/services/email';

@injectable()
export class VerificationRepository extends BaseRepository<Verification> {
  @inject(constants.EmailService) private emailService: IEmailService;

  constructor() {
    super('Verification', VerificationSchema);
  }

  /**
   * Creates a verification document and emails a
   * verification link to the email of a new user
   * @param user a recently created user
   */
  async sendVerification(user: User) {
    try {
      const verification = await this.model.create({ user_id: user._id });
      const sentEmail = this.emailService.send(
        user.email,
        'Email verification',
        null,
        `<a href="/verification?email=${user.email}&token=${
          verification.token
        }">Click on this link to verify your account</a>`,
      );
    } catch (err) {
      console.log(err);
    }
  }
}

/**
 * Verification Repository Interface
 */
export interface VerificationRepo extends Repository<Verification> {
  sendVerification(user: User);
}
