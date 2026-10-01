import { api, setBaseURL } from "mhz-helpers";

import { DEFAULT_API_URL, TRANSPORT_IMAGES, TRANSPORT_IMAGE_FALLBACK } from "../constants/index";

const API_TIMEOUT = 5000;

export function setupApi(): void {
  setBaseURL(DEFAULT_API_URL);
  api.defaults.timeout = API_TIMEOUT;
}

export function getTransportImage(title: string): string {
  return TRANSPORT_IMAGES[title] ?? TRANSPORT_IMAGE_FALLBACK;
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

export function formatOrderNumber(id: string): string {
  return `№ ${id.slice(-6).toUpperCase()}`;
}

export function formatDateInput(value?: string | number): string {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);

  return parts.join(".");
}
