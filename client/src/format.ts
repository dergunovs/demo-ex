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
