import bcrypt from "bcryptjs";

import {
  DATE_PATTERN,
  EMAIL_PATTERN,
  LOGIN_PATTERN,
  ORDER_STATUS_TRANSITIONS,
  PASSWORD_MIN,
  PHONE_PATTERN,
} from "driverf-contracts";

import type {
  ICustomer,
  IPaymentMethod,
  IOrder,
  IReview,
  ITransport,
  TOrderStatus,
  TRegisterData,
} from "driverf-contracts";

import type {
  ICustomerEntity,
  IPaymentMethodEntity,
  IReviewEntity,
  ITransportEntity,
} from "./models.ts";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function checkPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function parseRuDate(value: string): Date | undefined {
  if (!value || !DATE_PATTERN.test(value)) return undefined;

  const [day, month, year] = value.split(".").map(Number);
  const date = new Date(year, month - 1, day);

  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return undefined;
  }

  return date;
}

export function validateRegister(data: TRegisterData): string | undefined {
  if (!data) return "Заполните все поля формы";

  const { login, password, fullName, birthDate, phone, email } = data;

  if (!login || !password || !fullName || !birthDate || !phone || !email) {
    return "Заполните все поля формы";
  }

  if (!LOGIN_PATTERN.test(login)) {
    return "Логин: латинские буквы и цифры, минимум 6 символов";
  }

  if (password.length < PASSWORD_MIN) {
    return `Пароль: минимум ${PASSWORD_MIN} символов`;
  }

  if (!parseRuDate(birthDate)) {
    return "Дата рождения в формате ДД.ММ.ГГГГ";
  }

  if (!PHONE_PATTERN.test(phone)) {
    return "Некорректный номер телефона";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Некорректный e-mail";
  }

  return undefined;
}

export function validateStatusTransition(from: TOrderStatus, to: TOrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from].includes(to);
}

export function toCustomerDTO(customer: ICustomerEntity): ICustomer {
  return {
    _id: String(customer._id),
    login: customer.login,
    fullName: customer.fullName,
    birthDate: customer.birthDate,
    phone: customer.phone,
    email: customer.email,
    role: customer.role,
  };
}

export function toTransportDTO(transport: ITransportEntity): ITransport {
  return {
    _id: String(transport._id),
    title: transport.title,
    description: transport.description,
    price: transport.price,
  };
}

export function toPaymentMethodDTO(paymentMethod: IPaymentMethodEntity): IPaymentMethod {
  return {
    _id: String(paymentMethod._id),
    title: paymentMethod.title,
  };
}

export function toReviewDTO(review: IReviewEntity): IReview {
  return {
    _id: String(review._id),
    order: String(review.order),
    rating: review.rating,
    text: review.text,
    createdAt: review.createdAt.toISOString(),
  };
}

export function attachReviews(orders: IOrder[], reviews: IReviewEntity[]): IOrder[] {
  return orders.map((order) => {
    const review = reviews.find((item) => String(item.order) === order._id);

    return review ? { ...order, review: toReviewDTO(review) } : order;
  });
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
