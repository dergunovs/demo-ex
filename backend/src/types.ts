import { Types } from "mongoose";

import type { TRole, TOrderStatus } from "driverf-contracts";

export interface ICustomerEntity {
  _id: Types.ObjectId;
  login: string;
  password: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  role: TRole;
  createdAt: Date;
}

export interface ITransportEntity {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
}

export interface IPaymentMethodEntity {
  _id: Types.ObjectId;
  title: string;
}

export interface IOrderEntity {
  _id: Types.ObjectId;
  customer: Types.ObjectId;
  transport: Types.ObjectId;
  paymentMethod: Types.ObjectId;
  startDate: Date;
  status: TOrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewEntity {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  customer: Types.ObjectId;
  rating: number;
  text: string;
  createdAt: Date;
}

export interface ITokenPayload {
  _id: string;
  role: TRole;
}
