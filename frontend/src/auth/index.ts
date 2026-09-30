import { computed, shallowRef } from "vue";

import { deleteAuthHeader, deleteCookieToken, getCookieToken, setAuthHeader, setCookieToken } from "mhz-helpers";

import { TOKEN_NAME } from "driverf-contracts";

import { fetchMe } from "../api/index";

import type { ICustomer } from "driverf-contracts";

export const currentUser = shallowRef<ICustomer>();
export const isAuth = computed(() => !!currentUser.value);
export const isAdmin = computed(() => currentUser.value?.role === "admin");

export function applyToken(token: string): void {
  setCookieToken(token, TOKEN_NAME);
  setAuthHeader(token);
}

export function logoutUser(): void {
  deleteCookieToken(TOKEN_NAME);
  deleteAuthHeader();
  currentUser.value = undefined;
}

export async function restoreUser(): Promise<void> {
  const token = getCookieToken(TOKEN_NAME);

  if (!token) return;

  setAuthHeader(token);

  try {
    currentUser.value = (await fetchMe()).data;
  } catch {
    logoutUser();
  }
}
