import type { IResponse } from "@/types/api";
import type { IUser } from "./user.interface";

/** Body for POST /auth/login (goodlife-api loginSchema). */
export interface ILoginForm {
  email: string;
  password: string;
}

/** Body for POST /auth/change-password. */
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

/** Body for POST /auth/forgot-password. `app: "admin"` makes the emailed link open this portal. */
export interface IForgotPassword {
  email: string;
  app: "admin";
}

/** Body for POST /auth/reset-password; `token` comes from the emailed link. */
export interface IResetPassword {
  token: string;
  password: string;
}

/**
 * POST /auth/login → 201. `user` is top-level (not under `data`). The token is
 * only in the httpOnly `token` Set-Cookie, never the body (see `loginApi`).
 */
export interface ILoginResponse extends IResponse<never> {
  user: IUser;
}
