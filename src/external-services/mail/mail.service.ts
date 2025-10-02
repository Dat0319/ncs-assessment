import nodemailer from 'nodemailer';
import APP_CONFIG from '../../configs/app.config';
import { SendMailParams } from './mail.interface';

export default class MailService {
  private static instance: MailService;
  private transporter: nodemailer.Transporter;

  constructor() {
    if (MailService.instance) {
      return MailService.instance;
    }

    this.transporter = nodemailer.createTransport({
      host: APP_CONFIG.ENV.MAIL_CONFIG.SMTP_CONFIG.HOST,
      port: APP_CONFIG.ENV.MAIL_CONFIG.SMTP_CONFIG.PORT,
      secure: APP_CONFIG.ENV.MAIL_CONFIG.SMTP_CONFIG.SECURE,
      auth: {
        user: APP_CONFIG.ENV.MAIL_CONFIG.SMTP_CONFIG.AUTH.USER,
        pass: APP_CONFIG.ENV.MAIL_CONFIG.SMTP_CONFIG.AUTH.PASS,
      },
    });

    MailService.instance = this;
  }

  async send(params: SendMailParams) {
    return new Promise((resolve, reject) => {
      this.transporter
        .sendMail({
          from: '"ncs-assessment system" <ncs-assessment@gmail.com>', // sender address
          to: params.to, // list of receivers
          subject: params.subject, // Subject line
          html: params.content, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err));
    });
  }
}
