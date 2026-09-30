import { Schema, model } from "mongoose";

import { ORDER_STATUSES } from "driverf-contracts";

import type {
  ICustomerEntity,
  IOrderEntity,
  IPaymentMethodEntity,
  IReviewEntity,
  ITransportEntity,
} from "./types.ts";

const customerSchema = new Schema<ICustomerEntity>(
  {
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    birthDate: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

const transportSchema = new Schema<ITransportEntity>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { versionKey: false },
);

const paymentMethodSchema = new Schema<IPaymentMethodEntity>(
  {
    title: { type: String, required: true },
  },
  { versionKey: false },
);

const orderSchema = new Schema<IOrderEntity>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    transport: { type: Schema.Types.ObjectId, ref: "Transport", required: true },
    paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: "new" },
  },
  { versionKey: false, timestamps: true },
);

const reviewSchema = new Schema<IReviewEntity>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

export const CustomerModel = model<ICustomerEntity>("Customer", customerSchema);
export const TransportModel = model<ITransportEntity>("Transport", transportSchema);
export const PaymentMethodModel = model<IPaymentMethodEntity>("PaymentMethod", paymentMethodSchema);
export const OrderModel = model<IOrderEntity>("Order", orderSchema);
export const ReviewModel = model<IReviewEntity>("Review", reviewSchema);
