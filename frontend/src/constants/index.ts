import type { ISelectOption, TOrderStatus } from "../types/index";

export const DEFAULT_API_URL = "http://127.0.0.1:5000/api";

export const API_URLS = {
  register: "/register",
  login: "/login",
  me: "/me",
  transports: "/transports",
  paymentMethods: "/payment-methods",
  orders: "/orders",
  reviews: "/reviews",
} as const;

export const URLS = {
  home: "/",
  login: "/login",
  register: "/register",
  account: "/account",
  order: "/order",
  admin: "/admin",
} as const;

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

export const ORDER_STATUS_OPTIONS: ISelectOption[] = (
  Object.keys(ORDER_STATUS_LABEL) as TOrderStatus[]
).map((status) => ({
  _id: status,
  title: ORDER_STATUS_LABEL[status],
}));

export const SORT_OPTIONS: ISelectOption[] = [
  { _id: "createdAt", title: "По дате создания" },
  { _id: "startDate", title: "По дате начала обучения" },
  { _id: "status", title: "По статусу заявки" },
];

export const PASSWORD_MIN = 8;
export const DATE_PATTERN = /^\d{2}\.\d{2}\.\d{4}$/;

export const DATE_PLACEHOLDER = "ДД.ММ.ГГГГ";
export const DATE_LENGTH = 10;
export const REVIEW_RATING_MAX = 5;

export const SLIDE_INTERVAL = 3000;

export const SLIDES = [
  "/images/slider/slide-1.svg",
  "/images/slider/slide-2.svg",
  "/images/slider/slide-3.svg",
  "/images/slider/slide-4.svg",
];
