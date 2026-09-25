export type TRole = "customer" | "admin";
export type TOrderStatus = "new" | "inProgress" | "completed";

export interface ICustomer {
  _id: string;
  login: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  role: TRole;
}

export interface ITransport {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export interface IPaymentMethod {
  _id: string;
  title: string;
}

export interface IReview {
  _id: string;
  order: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface IOrder {
  _id: string;
  customer: ICustomer;
  transport: ITransport;
  paymentMethod: IPaymentMethod;
  startDate: string;
  status: TOrderStatus;
  review?: IReview;
}

export type TLoginData = {
  login: string;
  password: string;
};

export type TRegisterData = {
  login: string;
  password: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
};

export type TOrderFormData = {
  transport: string;
  startDate: string;
  paymentMethod: string;
};

export type TReviewData = {
  order: string;
  rating: number;
  text: string;
};

export type TLoginReply = {
  token: string;
  user: ICustomer;
};

export type TOrdersReply = {
  data: IOrder[];
  total: number;
};

export type TMessageReply = {
  message: string;
};

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
export const TOKEN_LIFETIME = "7d";

export const DATE_PLACEHOLDER = "ДД.ММ.ГГГГ";

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
