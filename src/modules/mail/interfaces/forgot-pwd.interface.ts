export interface ISendForgotPwdMail {
  to: string;
  context: IForgotPwdContext;
}

interface IForgotPwdContext {
  OTP: number;
}

export interface ISendResetPwdMail {
  to: string;
  context: IResetPwdContext;
}

interface IResetPwdContext {
  password: string;
}

export interface ISendChangePwdMail {
  to: string;
  context: IChangePwdContext;
}

interface IChangePwdContext {
  name: string;
}
export interface ISendRegisterMail {
  to: string;
  context: IRegisterContext;
}

interface IRegisterContext {
  name: string;
}

export interface ISendInviteMail {
  to: string[];
  context: IInviteContext;
}

interface IInviteContext {
  code: string;
  registerLink: string;
}

export interface ISendAdminInviteMail {
  to: string[];
  context: IAdminInviteContext;
}

interface IAdminInviteContext {
  companyName: string;
  pwd: string;
  userName: string;
  loginLink: string;
}
