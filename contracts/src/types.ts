export type TRole = "customer" | "admin";
export type TOrderStatus = "new" | "inProgress" | "completed";
export type TDirection = "asc" | "desc";

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
  createdAt: string;
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

export type TOrdersQuery = {
  page?: number;
  limit?: number;
  status?: string;
  transport?: string;
  search?: string;
  sort?: string;
  dir?: TDirection;
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
