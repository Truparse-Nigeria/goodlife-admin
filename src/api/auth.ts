import type { IChangePassword, ILoginForm, ILoginResponse } from "@/interface/auth.interface";
import type { IResponse } from "@/types/api";
import { authHeader, callApi, HttpMethod } from "./client";

/** goodlife-api's session cookie name (set by POST /auth/login). */
const TOKEN_COOKIE = "token";

/** Read the API token from the login response's Set-Cookie header. */
function readTokenCookie(setCookie: string | string[] | undefined): string | undefined {
  const cookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
  for (const cookie of cookies) {
    const [pair] = cookie.split(";");
    const eq = pair.indexOf("=");
    if (pair.slice(0, eq).trim() === TOKEN_COOKIE) return decodeURIComponent(pair.slice(eq + 1).trim());
  }
  return undefined;
}

/**
 * Sign in (shared by admins and customers — route by `data.role`).
 * Server-side only: the API returns its token solely as an httpOnly cookie, so
 * we read it from Set-Cookie, keep it in the app session and send it on later
 * calls via `authHeader`.
 */
export const loginApi = async (payload: ILoginForm) => {
  const { response, headers, error } = await callApi<ILoginForm, never, ILoginResponse>(
    "/auth/login",
    HttpMethod.POST,
    { data: payload },
  );
  const setCookie = headers?.["set-cookie"] as string | string[] | undefined;
  return { data: response?.user, token: readTokenCookie(setCookie), response, error };
};

/** Replace the password. The API revokes every token for the user, so sign in again after. */
export const changePasswordApi = async (token: string, body: IChangePassword) => {
  return await callApi<IChangePassword, never, IResponse<never>>("/auth/change-password", HttpMethod.POST, {
    data: body,
    headers: authHeader(token),
  });
};

/** Revoke the API token (it is whitelisted server-side until logout). */
export const logoutApi = async (token: string) => {
  return await callApi<never, never, IResponse<never>>("/auth/logout", HttpMethod.POST, {
    headers: authHeader(token),
  });
};
