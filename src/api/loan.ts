import type {
  ICreateLoan,
  ICreateLoanResult,
  IGetLoansParams,
  IInstallment,
  ILoanDetail,
  ILoanListItem,
  ILoansMeta,
  ILoanStats,
  IMyLoanListItem,
  IRecordPayment,
  IRepaymentSummary,
  IUpdateLoanStatus,
} from "@/interface/loan.interface";
import type { IPaginationMeta, IResponse } from "@/types/api";
import { API_BASE_URL, authHeader, callApi, HttpMethod } from "./client";

/** Admin: paginated loans with per-status counts. `token` is the session's API token. */
export const getAllLoansApi = async (token: string, params: IGetLoansParams = {}) => {
  return await callApi<never, ILoanListItem[], IResponse<ILoanListItem[], ILoansMeta>>("/admin/loans", HttpMethod.GET, {
    params: { ...params },
    headers: authHeader(token),
  });
};

/** Customer: their own loans, newest first. */
export const getMyLoansApi = async (token: string, params: { page?: number; limit?: number } = {}) => {
  return await callApi<never, IMyLoanListItem[], IResponse<IMyLoanListItem[], IPaginationMeta & { totalPages: number }>>(
    "/user/loans",
    HttpMethod.GET,
    { params: { ...params }, headers: authHeader(token) },
  );
};

/** Customer: one of their own loans, same shape as the admin detail (404 if not theirs). */
export const getMyLoanApi = async (token: string, id: string) => {
  return await callApi<never, ILoanDetail>(`/user/loans/${encodeURIComponent(id)}`, HttpMethod.GET, {
    headers: authHeader(token),
  });
};

/** Admin: portfolio KPIs for the dashboard. */
export const getLoanStatsApi = async (token: string) => {
  return await callApi<never, ILoanStats>("/admin/loans/stats", HttpMethod.GET, { headers: authHeader(token) });
};

/** Admin: one loan with applicant, business and documents. */
export const getLoanApi = async (token: string, id: string) => {
  const result = await callApi<never, ILoanDetail>(`/admin/loans/${encodeURIComponent(id)}`, HttpMethod.GET, {
    headers: authHeader(token),
  });
  // Older API versions omit the schedule: normalise once so callers can rely on it.
  const data = result.data && {
    ...result.data,
    installments: result.data.installments ?? [],
    repayment: result.data.repayment ?? null,
    lastPaymentId: result.data.lastPaymentId ?? null,
  };
  return { ...result, data };
};

/** Admin: approve (with interestPerMonth), reject or otherwise move a loan's status. */
export const updateLoanStatusApi = async (token: string, id: string, body: IUpdateLoanStatus) => {
  return await callApi<IUpdateLoanStatus, Pick<ILoanDetail, "id" | "status" | "interestPerMonth">>(
    `/admin/loans/${encodeURIComponent(id)}/status`,
    HttpMethod.PATCH,
    { data: body, headers: authHeader(token) },
  );
};

type PaymentResult = {
  loanStatus: ILoanDetail["status"];
  repayment: IRepaymentSummary;
  /** The month the payment went to (not returned on removal). */
  installment?: IInstallment;
};

const paymentsPath = (loanId: string) => `/admin/loans/${encodeURIComponent(loanId)}/payments`;

/** Admin: record a payment against the loan's open month. */
export const recordPaymentApi = async (token: string, loanId: string, body: IRecordPayment) => {
  return await callApi<IRecordPayment, PaymentResult>(paymentsPath(loanId), HttpMethod.POST, {
    data: body,
    headers: authHeader(token),
  });
};

/** Admin: undo the loan's most recent payment. */
export const deletePaymentApi = async (token: string, loanId: string, paymentId: string) => {
  return await callApi<never, PaymentResult>(
    `${paymentsPath(loanId)}/${encodeURIComponent(paymentId)}`,
    HttpMethod.DELETE,
    { headers: authHeader(token) },
  );
};

/** Admin: build and save the prefilled loan form for a loan that has none yet. */
export const generateLoanFormApi = async (token: string, loanId: string) => {
  return await callApi<never, { loanForm: string }>(
    `/admin/loans/${encodeURIComponent(loanId)}/loan-form`,
    HttpMethod.POST,
    { headers: authHeader(token) },
  );
};

/** Admin: apply for a loan on a customer's behalf (new or existing account). */
export const createLoanApi = async (token: string, body: ICreateLoan) => {
  return await callApi<ICreateLoan, ICreateLoanResult>("/admin/loans", HttpMethod.POST, {
    data: body,
    headers: authHeader(token),
  });
};

/**
 * Admin: every loan matching the list's filters as an .xlsx file.
 * A raw fetch, not callApi: the body is a file, not the JSON envelope.
 */
export const exportLoansApi = async (token: string, params: Omit<IGetLoansParams, "page" | "limit">) => {
  const url = new URL(`${API_BASE_URL}/admin/loans/export`);
  for (const [key, value] of Object.entries(params)) if (value) url.searchParams.set(key, String(value));
  return fetch(url, { headers: authHeader(token), cache: "no-store" });
};

/** Public: NIGERIAN_STATES, for address pickers. */
export const getStatesApi = async () => {
  return await callApi<never, string[]>("/loan/states", HttpMethod.GET);
};

/** Public: industries a business can be in. */
export const getIndustriesApi = async () => {
  return await callApi<never, string[]>("/loan/industries", HttpMethod.GET);
};
