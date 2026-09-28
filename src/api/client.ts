import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type RawAxiosResponseHeaders } from "axios";
import { setLogout } from "@/store/authStore";
import type { ApiError, IResponse } from "@/types/api";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

/** Where the API's "PasswordChangeRequired" 403 sends the admin. */
const PASSWORD_CHANGE_PATH = "/change-password";

/** 401s from these endpoints are wrong credentials, not an expired session. */
const AUTH_ENDPOINTS = ["/auth/login"];

const DEFAULT_BASE_URL = "https://api.goodlifecreditng.com/api/v1";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE_URL,
  timeout: 1000 * 60,
  // goodlife-api authenticates with an httpOnly `token` cookie.
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // Let the browser set multipart boundaries for uploads.
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<IResponse<unknown>>) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    switch (status) {
      case 401:
        if (!AUTH_ENDPOINTS.some((endpoint) => url.startsWith(endpoint))) setLogout();
        break;
      case 403:
        if (error.response?.data?.error === "PasswordChangeRequired" && typeof window !== "undefined") {
          // Interceptors run outside React, so a full navigation instead of the router.
          window.location.assign(new URL(PASSWORD_CHANGE_PATH, window.location.origin));
        }
        break;
      case 500:
        console.error("Server error:", error.response?.data?.message ?? error.message);
        break;
    }

    return Promise.reject(error);
  },
);

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError<IResponse<unknown>>(error)) {
    const { response } = error;
    if (!response) {
      return { message: error.code === "ECONNABORTED" ? "The request timed out." : error.message, status: "Error" };
    }
    return {
      message:
        response.status === 429
          ? "Too many requests. Please try again later."
          : (response.data?.message ?? error.message),
      status: response.status,
      code: response.data?.error,
      data: response.data?.data,
    };
  }
  return { message: error instanceof Error ? error.message : "Something went wrong.", status: "Error" };
}

/**
 * Call a goodlife-api endpoint. Never throws.
 * `data` is the envelope's `data`; `response` is the full envelope (message, meta, …).
 * Pass `TEnvelope` for endpoints that return fields outside `data` (e.g. login's `user`).
 *
 * @example
 * const { data: loans, response, error } = await callApi<never, Loan[]>("/admin/loans", HttpMethod.GET, {
 *   params: { page: 1, status: "pending" },
 * });
 */
export const callApi = async <TBody, TData, TEnvelope extends IResponse<TData> = IResponse<TData>>(
  url: string,
  method: HttpMethod,
  options?: {
    data?: TBody;
    params?: Record<string, unknown>;
    /** Extra request headers, e.g. `authHeader(token)` for server-side calls. */
    headers?: Record<string, string>;
  },
): Promise<{ data?: TData; response?: TEnvelope; headers?: RawAxiosResponseHeaders; error?: ApiError }> => {
  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      params: options?.params,
      data: method === HttpMethod.GET ? undefined : options?.data,
      headers: options?.headers,
    };
    const response = await apiClient.request<TEnvelope>(config);
    return { data: response.data.data, response: response.data, headers: response.headers as RawAxiosResponseHeaders };
  } catch (error) {
    return { error: toApiError(error) };
  }
};

/**
 * Authenticate a server-side call (server actions, RSC) as the session user.
 * Browser calls don't need it: they send goodlife-api's `token` cookie.
 */
export const authHeader = (token: string): Record<string, string> => ({ Authorization: `Bearer ${token}` });
