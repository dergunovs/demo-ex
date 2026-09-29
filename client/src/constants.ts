import type { ISelectOption, TOrderStatus } from "./types";

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

export const ORDER_STATUS_OPTIONS: ISelectOption[] = ORDER_STATUSES.map((status) => ({
  _id: status,
  title: ORDER_STATUS_LABEL[status],
}));

export const SORT_OPTIONS: ISelectOption[] = [
  { _id: "createdAt", title: "По дате создания" },
  { _id: "startDate", title: "По дате начала обучения" },
  { _id: "status", title: "По статусу заявки" },
];

export const LOGIN_PATTERN = /^[a-zA-Z0-9]{6,}$/;
export const PASSWORD_MIN = 8;
export const DATE_PATTERN = /^\d{2}\.\d{2}\.\d{4}$/;
export const PHONE_PATTERN = /^\+?[\d\s()-]{10,18}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const DATE_PLACEHOLDER = "ДД.ММ.ГГГГ";
export const DATE_LENGTH = 10;
export const REVIEW_RATING_MAX = 5;
export const REVIEW_TEXT_MIN = 10;
export const PAGE_LIMIT = 5;
export const ACCOUNT_ORDERS_LIMIT = 50;
export const SLIDE_INTERVAL = 3000;

export const PHONE_PLACEHOLDER = "+7 (900) 000-00-00";
export const LOGIN_HINT = "Латинские буквы и цифры, минимум 6 символов";
export const SEARCH_HINT = "Поиск по ФИО, логину или почте";
export const ADMIN_HINT = "Панель администратора доступна после входа с логином Admin26";

export const TOKEN_NAME = "driverfToken";

export const SLIDES = [
  "/images/slider/slide-1.svg",
  "/images/slider/slide-2.svg",
  "/images/slider/slide-3.svg",
  "/images/slider/slide-4.svg",
];
