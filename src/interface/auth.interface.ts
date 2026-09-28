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

/**
 * POST /auth/login → 201. `user` is top-level (not under `data`). The token is
 * only in the httpOnly `token` Set-Cookie, never the body (see `loginApi`).
 */
export interface ILoginResponse extends IResponse<never> {
  user: IUser;
}
