import type { TDirection } from "driverf-contracts";

export interface ISelectOption {
  _id?: string;
  title: string;
}

export interface IOrdersFilter {
  status: string;
  transport: string;
  search: string;
}

export interface IOrdersSort {
  field: string;
  dir: TDirection;
}
