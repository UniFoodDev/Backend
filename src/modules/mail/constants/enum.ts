export enum EEmailSubject {
  FORGOT_PASSWORD = '[GCT] Forgot password email',
  CHANGE_PASSWORD = '[GCT] Change password email',
  RESET_PASSWORD = '[GCT] Reset password email',
  REGISTER_PASSWORD = '[GCT] Register email',
  INVITE = '[GCT] Invite email',
  ADMIN_INVITE = '[GCT] Invite email by admin',
}

export enum EEmailTemplate {
  FORGOT_PASSWORD = './forgot-password.hbs',
  CHANGE_PASSWORD = './change-password.hbs',
  RESET_PASSWORD = './reset-password.hbs',
  REGISTER_PASSWORD = './register.hbs',
  INVITE = './invite-user.hbs',
  ADMIN_INVITE = './admin-invite-user.hbs',
}
