import { hashPassword } from "./helpers.ts";
import { CustomerModel, PaymentMethodModel, TransportModel } from "./models.ts";

const TRANSPORTS = [
  {
    title: "Катер",
    description: "Курс управления маломерным катером: теория, практика на воде, подготовка к экзамену ГИМС.",
    price: 42000,
  },
  {
    title: "Круизный лайнер",
    description: "Программа для работы на круизных лайнерах: навигация, безопасность пассажиров, международные правила.",
    price: 96000,
  },
  {
    title: "Яхта",
    description: "Курс управления парусной и моторной яхтой: работа с парусами, швартовка, навигация.",
    price: 68000,
  },
];

const PAYMENT_METHODS = [
  { title: "Наличные" },
  { title: "Банковская карта" },
  { title: "Безналичный перевод" },
];

export async function seedAdmin(): Promise<void> {
  const login = process.env.ADMIN_LOGIN ?? "Admin26";

  if (await CustomerModel.findOne({ login })) return;

  await CustomerModel.create({
    login,
    password: await hashPassword(process.env.ADMIN_PASSWORD ?? "Demo20"),
    fullName: "Администратор портала",
    birthDate: "01.01.1980",
    phone: "+7 (900) 000-00-00",
    email: "admin@vodit.rf",
    role: "admin",
  });
}

export async function seedTransports(): Promise<void> {
  if (await TransportModel.countDocuments()) return;

  await TransportModel.create(TRANSPORTS);
}

export async function seedPaymentMethods(): Promise<void> {
  if (await PaymentMethodModel.countDocuments()) return;

  await PaymentMethodModel.create(PAYMENT_METHODS);
}

export async function seed(): Promise<void> {
  await seedAdmin();
  await seedTransports();
  await seedPaymentMethods();
}
