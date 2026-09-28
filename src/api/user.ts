import type { IGetUsersParams, IUserDetail, IUserListItem } from "@/interface/user.interface";
import type { IPaginationMeta, IResponse } from "@/types/api";
import { authHeader, callApi, HttpMethod } from "./client";

type UsersMeta = IPaginationMeta & { totalPages: number };

/** Admin: paginated customers with loan totals. */
export const getUsersApi = async (token: string, params: IGetUsersParams = {}) => {
  return await callApi<never, IUserListItem[], IResponse<IUserListItem[], UsersMeta>>("/admin/users", HttpMethod.GET, {
    params: { ...params },
    headers: authHeader(token),
  });
};

/** Admin: one customer with profile, loans, totals and activity. */
export const getUserApi = async (token: string, id: string) => {
  return await callApi<never, IUserDetail>(`/admin/users/${encodeURIComponent(id)}`, HttpMethod.GET, {
    headers: authHeader(token),
  });
};
