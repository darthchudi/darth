import mailgun, { Mailgun } from 'mailgun-js';
import { injectable } from 'inversify';
import env from '../config/env';

export interface IEmailService {
  sender: string;
  mailgun: Mailgun;
  send(
    reciever: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<Boolean>;
}

@injectable()
export default class EmailService implements IEmailService {
  sender: string;
  mailgun: Mailgun;
  constructor() {
    this.mailgun = new mailgun({
      apiKey: env.mailgun_api_key,
      domain: env.mailgun_domain,
    });
    this.sender = env.mailgun_email;
  }

  send(reciever: string, subject: string, text: string, html?: string) {
    return new Promise<Boolean>((resolve, reject) => {
      const data = {
        from: this.sender,
        to: reciever,
        subject,
        text,
        html,
      };

      this.mailgun.messages().send(data, (err, _) => {
        if (err) return reject(err);

        resolve(true);
      });
    });
  }
}
