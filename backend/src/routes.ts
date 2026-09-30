import { Types } from "mongoose";

import {
  API_URLS,
  ORDER_SORT_FIELDS,
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  PAGE_LIMIT,
} from "driverf-contracts";

import { TOKEN_LIFETIME } from "./constants.ts";

import {
  attachReviews,
  checkPassword,
  escapeRegExp,
  hashPassword,
  parseRuDate,
  toCustomerDTO,
  toPaymentMethodDTO,
  toTransportDTO,
  validateRegister,
  validateStatusTransition,
} from "./helpers.ts";

import {
  CustomerModel,
  OrderModel,
  PaymentMethodModel,
  ReviewModel,
  TransportModel,
} from "./models.ts";

import type { QueryFilter } from "mongoose";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type {
  IOrder,
  TRole,
  TLoginData,
  TOrderFormData,
  TOrderStatus,
  TRegisterData,
  TReviewData,
} from "driverf-contracts";

import type {
  ICustomerEntity,
  IOrderEntity,
  IPaymentMethodEntity,
  ITransportEntity,
} from "./models.ts";

interface ITokenPayload {
  _id: string;
  role: TRole;
}

function isId(value: string | undefined): value is string {
  return !!value && Types.ObjectId.isValid(value);
}

async function getTokenPayload(request: FastifyRequest): Promise<ITokenPayload | undefined> {
  try {
    return await request.jwtVerify<ITokenPayload>();
  } catch {
    return undefined;
  }
}

function sendUnauthorized(reply: FastifyReply) {
  return reply.code(401).send({ message: "Требуется авторизация" });
}

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.post(API_URLS.register, async (request, reply) => {
    const data = request.body as TRegisterData;
    const error = validateRegister(data);

    if (error) return reply.code(400).send({ message: error });

    if (await CustomerModel.findOne({ login: data.login })) {
      return reply.code(409).send({ message: "Логин уже занят" });
    }

    const customer = await CustomerModel.create({
      login: data.login,
      password: await hashPassword(data.password),
      fullName: data.fullName,
      birthDate: data.birthDate,
      phone: data.phone,
      email: data.email,
      role: "customer",
    });

    return reply.code(201).send({ message: `Пользователь ${customer.login} зарегистрирован` });
  });

  app.post(API_URLS.login, async (request, reply) => {
    const data = request.body as TLoginData;

    if (!data?.login || !data?.password) {
      return reply.code(400).send({ message: "Введите логин и пароль" });
    }

    const customer = await CustomerModel.findOne({ login: data.login });

    if (!customer) {
      return reply.code(404).send({ message: "Пользователь с таким логином не найден" });
    }

    if (!(await checkPassword(data.password, customer.password))) {
      return reply.code(401).send({ message: "Неверный пароль" });
    }

    const token = app.jwt.sign({ _id: String(customer._id), role: customer.role }, { expiresIn: TOKEN_LIFETIME });

    return reply.send({ token, user: toCustomerDTO(customer) });
  });

  app.get(API_URLS.me, async (request, reply) => {
    const payload = await getTokenPayload(request);

    if (!payload) return sendUnauthorized(reply);

    const customer = await CustomerModel.findById(payload._id);

    if (!customer) return reply.code(404).send({ message: "Пользователь не найден" });

    return reply.send(toCustomerDTO(customer));
  });

  app.get(API_URLS.transports, async () => {
    const transports = await TransportModel.find().sort({ price: 1 });

    return transports.map(toTransportDTO);
  });

  app.get(API_URLS.paymentMethods, async () => {
    const paymentMethods = await PaymentMethodModel.find();

    return paymentMethods.map(toPaymentMethodDTO);
  });
  app.post(API_URLS.orders, async (request, reply) => {
    const payload = await getTokenPayload(request);

    if (!payload) return sendUnauthorized(reply);

    if (payload.role !== "customer") {
      return reply.code(403).send({ message: "Заявки оформляют только клиенты" });
    }

    const data = request.body as TOrderFormData;
    const startDate = parseRuDate(data?.startDate);

    if (!startDate || !isId(data?.transport) || !isId(data?.paymentMethod)) {
      return reply.code(400).send({ message: "Выберите транспорт, дату начала обучения и способ оплаты" });
    }

    const [transport, paymentMethod] = await Promise.all([
      TransportModel.findById(data.transport),
      PaymentMethodModel.findById(data.paymentMethod),
    ]);

    if (!transport || !paymentMethod) {
      return reply.code(404).send({ message: "Справочные данные не найдены" });
    }

    const order = await OrderModel.create({
      customer: new Types.ObjectId(payload._id),
      transport: new Types.ObjectId(data.transport),
      paymentMethod: new Types.ObjectId(data.paymentMethod),
      startDate,
      status: "new",
    });

    return reply.code(201).send({ message: "Заявка отправлена на согласование", _id: String(order._id) });
  });
  app.get(API_URLS.orders, async (request, reply) => {
    const payload = await getTokenPayload(request);

    if (!payload) return sendUnauthorized(reply);

    const query = request.query as Record<string, string | undefined>;
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || PAGE_LIMIT, 1);
    const isAdmin = payload.role === "admin";
    const filter: QueryFilter<IOrderEntity> = {};

    if (!isAdmin) filter.customer = new Types.ObjectId(payload._id);

    if (query.status && ORDER_STATUSES.includes(query.status as TOrderStatus)) {
      filter.status = query.status as TOrderStatus;
    }

    if (isId(query.transport)) {
      filter.transport = new Types.ObjectId(query.transport);
    }

    const search = isAdmin ? query.search?.trim() : undefined;

    if (search) {
      const pattern = new RegExp(escapeRegExp(search), "i");
      const customers = await CustomerModel.find({
        $or: [{ fullName: pattern }, { login: pattern }, { email: pattern }],
      }).select("_id");

      filter.customer = { $in: customers.map((customer) => String(customer._id)) };
    }

    const sort = query.sort && ORDER_SORT_FIELDS.includes(query.sort) ? query.sort : "createdAt";
    const sortDir: 1 | -1 = query.dir === "asc" ? 1 : -1;

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ [sort]: sortDir })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate<{ customer: ICustomerEntity }>("customer")
        .populate<{ transport: ITransportEntity }>("transport")
        .populate<{ paymentMethod: IPaymentMethodEntity }>("paymentMethod"),
      OrderModel.countDocuments(filter),
    ]);

    const reviews = await ReviewModel.find({ order: { $in: orders.map((order) => String(order._id)) } });

    const data: IOrder[] = orders.map((order) => ({
      _id: String(order._id),
      customer: toCustomerDTO(order.customer),
      transport: toTransportDTO(order.transport),
      paymentMethod: toPaymentMethodDTO(order.paymentMethod),
      startDate: order.startDate.toISOString(),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    return reply.send({ data: attachReviews(data, reviews), total });
  });
  app.patch(`${API_URLS.orders}/:id`, async (request, reply) => {
    const payload = await getTokenPayload(request);

    if (!payload) return sendUnauthorized(reply);

    if (payload.role !== "admin") {
      return reply.code(403).send({ message: "Менять статус заявки может только администратор" });
    }

    const { id } = request.params as { id: string };
    const { status } = request.body as { status: TOrderStatus };

    if (!ORDER_STATUSES.includes(status)) {
      return reply.code(400).send({ message: "Неизвестный статус заявки" });
    }

    if (!isId(id)) return reply.code(404).send({ message: "Заявка не найдена" });

    const order = await OrderModel.findById(id);

    if (!order) return reply.code(404).send({ message: "Заявка не найдена" });

    if (!validateStatusTransition(order.status, status)) {
      return reply.code(403).send({
        message: `Нельзя сменить статус «${ORDER_STATUS_LABEL[order.status]}» на «${ORDER_STATUS_LABEL[status]}»`,
      });
    }

    order.status = status;
    await order.save();

    return reply.send({ message: `Статус заявки: ${ORDER_STATUS_LABEL[status]}` });
  });

  app.post(API_URLS.reviews, async (request, reply) => {
    const payload = await getTokenPayload(request);

    if (!payload) return sendUnauthorized(reply);

    const data = request.body as TReviewData;
    const rating = Number(data?.rating);

    if (!isId(data?.order)) return reply.code(404).send({ message: "Заявка не найдена" });

    if (!data?.text?.trim() || !Number.isFinite(rating)) {
      return reply.code(400).send({ message: "Поставьте оценку и напишите текст отзыва" });
    }

    if (rating < 1 || rating > 5) {
      return reply.code(400).send({ message: "Оценка должна быть от 1 до 5" });
    }

    const order = await OrderModel.findById(data.order);

    if (!order) return reply.code(404).send({ message: "Заявка не найдена" });

    if (String(order.customer) !== payload._id) {
      return reply.code(403).send({ message: "Отзыв можно оставить только по своей заявке" });
    }

    if (order.status !== "completed") {
      return reply.code(403).send({ message: "Отзыв доступен после завершения обучения" });
    }

    if (await ReviewModel.findOne({ order: data.order })) {
      return reply.code(409).send({ message: "Отзыв по этой заявке уже оставлен" });
    }

    await ReviewModel.create({
      order: new Types.ObjectId(data.order),
      customer: new Types.ObjectId(payload._id),
      rating,
      text: data.text.trim(),
    });

    return reply.code(201).send({ message: "Спасибо за отзыв" });
  });





}
