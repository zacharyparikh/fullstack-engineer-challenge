import type { Customer } from './Customer';

enum InsuranceType {
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
  customer: Customer;
  provider: string;
  insuranceType: InsuranceType;
  status: PolicyStatus;
  policyNumber: string;
  startDate: number;
  endDate: number;
  createdAt: number;
}
