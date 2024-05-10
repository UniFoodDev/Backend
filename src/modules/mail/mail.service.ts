import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EEmailSubject, EEmailTemplate } from './constants/enum';
import {
  ISendAdminInviteMail,
  ISendChangePwdMail,
  ISendForgotPwdMail,
  ISendInviteMail,
  ISendRegisterMail,
  ISendResetPwdMail,
} from './interfaces/forgot-pwd.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendForgotPwdEmail(payload: ISendForgotPwdMail) {
    try {
      console.log(payload.to);
      console.log(payload.context);
      await this.mailerService.sendMail({
        to: payload.to,
        subject: EEmailSubject.FORGOT_PASSWORD,
        template: EEmailTemplate.FORGOT_PASSWORD,
        context: payload.context,
      });
    } catch (e) {
      console.log(e);
    }
  }
  async sendResetPwdEmail(payload: ISendResetPwdMail) {
    try {
      const context = payload.context;
      await this.mailerService.sendMail({
        to: payload.to,
        subject: EEmailSubject.RESET_PASSWORD,
        template: EEmailTemplate.RESET_PASSWORD,
        context: context,
      });
    } catch (e) {
      console.log(e);
    }
  }
  async sendChangePwdEmail(payload: ISendChangePwdMail) {
    try {
      await this.mailerService.sendMail({
        to: payload.to,
        subject: EEmailSubject.CHANGE_PASSWORD,
        template: EEmailTemplate.CHANGE_PASSWORD,
        context: payload.context,
      });
    } catch (e) {
      console.log(e);
    }
  }
  async sendRegisterEmail(payload: ISendRegisterMail) {
    try {
      await this.mailerService.sendMail({
        to: payload.to,
        subject: EEmailSubject.REGISTER_PASSWORD,
        template: EEmailTemplate.REGISTER_PASSWORD,
        context: payload.context,
      });
    } catch (e) {
      console.log(e);
    }
  }
  async sendInviteEmail(payload: ISendInviteMail) {
    try {
      await this.mailerService.sendMail({
        to: payload.to,
        subject: EEmailSubject.INVITE,
        template: EEmailTemplate.INVITE,
        context: payload.context,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendAdminInviteEmail(payload: ISendAdminInviteMail) {
    try {
      await this.mailerService.sendMail({
        to: payload.to,
        subject: EEmailSubject.ADMIN_INVITE,
        template: EEmailTemplate.ADMIN_INVITE,
        context: payload.context,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
