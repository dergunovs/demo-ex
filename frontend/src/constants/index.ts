import { ORDER_STATUS_LABEL } from "driverf-contracts";

import type { TOrderStatus } from "driverf-contracts";
import type { ISelectOption } from "../types/index";

export const DEFAULT_API_URL = "http://127.0.0.1:5000/api";

export const URLS = {
  home: "/",
  login: "/login",
  register: "/register",
  account: "/account",
  order: "/order",
  admin: "/admin",
} as const;

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
  "/images/slider/slide-1.jpg",
  "/images/slider/slide-2.jpg",
  "/images/slider/slide-3.jpg",
  "/images/slider/slide-4.jpg",
  "/images/slider/slide-5.jpg",
];

export const LOGO = {
  icon: "/images/logo/logo.png",
  title: "Водить.РФ",
} as const;

export const TRANSPORT_IMAGES: Record<string, string> = {
  "Катер": "/images/transports/kater.jpg",
  "Круизный лайнер": "/images/transports/liner.jpg",
  "Яхта": "/images/transports/yacht.jpg",
};

export const TRANSPORT_IMAGE_FALLBACK = "/images/logo/logo.png";

export const SOCIAL = {
  url: "https://vk.com/vodit_rf",
  icon: "/images/soc.png",
  title: "Мы во ВКонтакте",
} as const;
