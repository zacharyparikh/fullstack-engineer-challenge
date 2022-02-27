export enum Order {
  ASC,
  DESC
}

export interface SortBy {
  fields: string[];
  order: Order
}
