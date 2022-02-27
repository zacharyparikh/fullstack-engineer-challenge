import { writeFile } from 'fs/promises';
import { faker } from '@faker-js/faker';
import { InsuranceType, PolicyStatus } from './types/Policy';

interface Customer {
  firstName: string;
  lastName: string;
  dateOfBirth: number;
}

interface Policy {
  customer: Customer;
  provider: string;
  insuranceType: InsuranceType;
  status: PolicyStatus;
  policyNumber: string;
  startDate: number;
  endDate: number;
  createdAt: number;
}

const insuranceTypes: InsuranceType[] = [
  InsuranceType.LIABILITY,
  InsuranceType.HOUSEHOLD,
  InsuranceType.HEALTH,
];

const randomElement = <T>(array: T[]): T => array[Math.trunc(Math.random() * array.length)] as T;

const generateCustomer = (): Customer => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  dateOfBirth: faker.date.between('1950-01-01', '2003-01-01').getTime(),
});

let id = 1;
const now = new Date();
const generatePolicy = (customers: Customer[]): Policy => {
  const customer = randomElement(customers);
  const createdAtDate = faker.date.between(
    new Date(customer.dateOfBirth).toISOString(),
    now.toISOString(),
  );
  const start = faker.date.future(20, createdAtDate.toISOString());
  const end = faker.date.future(20, start.toISOString());

  const startDate = start.getTime();
  const endDate = end.getTime();
  const createdAt = createdAtDate.getTime();

  const generatePolicyStatus = (): PolicyStatus => {
    const nowTime = now.getTime();
    if (nowTime < startDate) {
      return PolicyStatus.PENDING;
    }

    if (nowTime > endDate) {
      return PolicyStatus.CANCELLED;
    }

    return randomElement([PolicyStatus.ACTIVE, PolicyStatus.DROPPED_OUT]);
  };

  const policyNumber = String(id);
  id += 1;
  return {
    customer,
    provider: faker.company.companyName(0),
    insuranceType: randomElement(insuranceTypes),
    status: generatePolicyStatus(),
    policyNumber,
    startDate,
    endDate,
    createdAt,
  };
};

const customers: Customer[] = new Array(100).fill(null).map(generateCustomer);
const policies: Policy[] = new Array(300).fill(null).map(() => generatePolicy(customers));

writeFile('data/customers.json', JSON.stringify(customers));
writeFile('data/policies.json', JSON.stringify(policies));
