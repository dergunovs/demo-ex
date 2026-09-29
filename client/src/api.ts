import { api, setBaseURL } from "mhz-helpers";

import { API_URLS, DEFAULT_API_URL } from "./constants";

import type {
  ICustomer,
  IPaymentMethod,
  ITransport,
  TLoginData,
  TLoginReply,
  TMessageReply,
  TOrderFormData,
  TOrdersQuery,
  TOrdersReply,
  TOrderStatus,
  TRegisterData,
  TReviewData,
} from "./types";

const API_TIMEOUT = 5000;

export function setupApi(): void {
  setBaseURL(DEFAULT_API_URL);
  api.defaults.timeout = API_TIMEOUT;
}

export function registerCustomer(data: TRegisterData) {
  return api.post<TMessageReply>(API_URLS.register, data);
}

export function loginCustomer(data: TLoginData) {
  return api.post<TLoginReply>(API_URLS.login, data);
}

export function fetchMe() {
  return api.get<ICustomer>(API_URLS.me);
}

export function fetchTransports() {
  return api.get<ITransport[]>(API_URLS.transports);
}

export function fetchPaymentMethods() {
  return api.get<IPaymentMethod[]>(API_URLS.paymentMethods);
}

export function createOrder(data: TOrderFormData) {
  return api.post<TMessageReply>(API_URLS.orders, data);
}

export function fetchOrders(query: TOrdersQuery) {
  return api.get<TOrdersReply>(API_URLS.orders, { params: query });
}

export function updateOrderStatus(id: string, status: TOrderStatus) {
  return api.patch<TMessageReply>(`${API_URLS.orders}/${id}`, { status });
}

export function createReview(data: TReviewData) {
  return api.post<TMessageReply>(API_URLS.reviews, data);
}
