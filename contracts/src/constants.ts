import type { TOrderStatus } from "./types.ts";

export const API_URLS = {
  register: "/register",
  login: "/login",
  me: "/me",
  transports: "/transports",
  paymentMethods: "/payment-methods",
  orders: "/orders",
  reviews: "/reviews",
} as const;

export const ORDER_STATUSES: TOrderStatus[] = ["new", "inProgress", "completed"];

export const ORDER_STATUS_LABEL: Record<TOrderStatus, string> = {
  new: "Новая",
  inProgress: "Идет обучение",
  completed: "Обучение завершено",
};

export const ORDER_STATUS_TRANSITIONS: Record<TOrderStatus, TOrderStatus[]> = {
  new: ["inProgress", "completed"],
  inProgress: ["completed"],
  completed: [],
};

export const ORDER_SORT_FIELDS: string[] = ["createdAt", "startDate", "status"];

export const PAGE_LIMIT = 5;

export const LOGIN_PATTERN = /^[a-zA-Z0-9]{6,}$/;
export const PASSWORD_MIN = 8;
export const DATE_PATTERN = /^\d{2}\.\d{2}\.\d{4}$/;
export const PHONE_PATTERN = /^\+?[\d\s()-]{10,18}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const TOKEN_NAME = "driverfToken";

export const DATE_PLACEHOLDER = "ДД.ММ.ГГГГ";
