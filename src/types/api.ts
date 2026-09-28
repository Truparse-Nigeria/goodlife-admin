/** Pagination block returned by list endpoints (e.g. GET /admin/loans). */
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

/**
 * Envelope every goodlife-api endpoint responds with.
 * Success: `{ success: true, message?, data?, meta? }`
 * Failure: `{ success: false, message, data?, responseCode?, error? }`
 */
export interface IResponse<T, TMeta = IPaginationMeta> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: TMeta;
  /** HTTP status echoed by the API's error handler. */
  responseCode?: number;
  /** Machine-readable error code, e.g. "PasswordChangeRequired". */
  error?: string;
}

/** Normalised error handed back to callers of `callApi`. */
export interface ApiError {
  message: string;
  /** HTTP status, or "Error" when the request never got a response. */
  status: number | "Error";
  /** Machine-readable code from the API, when present. */
  code?: string;
  /** Extra payload from the API (e.g. validation details). */
  data?: unknown;
}
