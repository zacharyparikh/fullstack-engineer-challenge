import type { Customer } from './Customer';

export enum InsuranceType {
  LIABILITY = 'LIABILITY',
  HOUSEHOLD = 'HOUSEHOLD',
  HEALTH = 'HEALTH',
}

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  DROPPED_OUT = 'DROPPED_OUT',
}

export interface Policy {
  [index: string]: Customer | string | number;
  customer: Customer;
  provider: string;
  insuranceType: string;
  status: string;
  policyNumber: number;
  startDate: number;
  endDate: number;
  createdAt: number;
}
