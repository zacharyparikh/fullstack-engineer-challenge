import { ApolloServer, gql } from 'apollo-server';
import { GraphQLScalarType, Kind } from 'graphql';
import customers from '../data/customers.json';
import policies from '../data/policies.json';
import { Policy } from './types/Policy';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

const typeDefs = gql`
  scalar Date

  enum Order {
    ASC
    DESC
  }

  input SortBy {
    fields: [String]
    order: Order
  }

  type Customer {
    firstName: String
    lastName: String
    dateOfBirth: Date
  }

  type Policy {
    customer: Customer
    provider: String
    insuranceType: InsuranceType
    status: PolicyStatus
    policyNumber: Int
    startDate: Date
    endDate: Date
    createdAt: Date
  }

  enum InsuranceType {
    LIABILITY
    HOUSEHOLD
    HEALTH
  }

  enum PolicyStatus {
    ACTIVE
    PENDING
    CANCELLED
    DROPPED_OUT
  }

  type PolicyList {
    policies: [Policy]!
    total: Int
    hasNextPage: Boolean
  }

  type Query {
    policyList(offset: Int, limit: Int, sort: SortBy): PolicyList
    customers: [Customer]
  }
`;

enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
}

interface SortBy {
  fields: string[];
  order: Order;
}

const sortedPolicyLists = new Map<string, Policy[]>();

type Customer = Policy['customer'];
const sortPolicies = (policiesList: Policy[], sort: SortBy): Policy[] => {
  const { fields, order } = sort;
  const getSortedByValue = (policy: Policy) => fields
    .reduce((acc: Policy | Customer | string | number, field) => {
      if (typeof acc === 'object') {
        if (field in acc) {
          return acc[field];
        }
        throw new Error(`property ${field} does not exist on ${acc}`);
      }
      return acc;
    }, policy);

  const sortByField = fields[fields.length - 1];
  const sortedPolicyListKey = `${sortByField}:${order}`;
  const sortedPolicyList = sortedPolicyLists.get(sortedPolicyListKey);
  if (sortedPolicyList !== undefined) {
    return sortedPolicyList;
  }

  const newSortedPolicyList = [...policiesList].sort((policyA, policyB) => {
    const valueA = getSortedByValue(policyA);
    const valueB = getSortedByValue(policyB);
    const sign = order === Order.ASC ? 1 : -1;

    if (typeof valueA === 'object' || typeof valueB === 'object') {
      throw new Error('cannot sort by object type');
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sign * (valueA - valueB);
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return (valueA < valueB) ? sign * -1 : sign * 1;
    }

    throw new Error('sort values were not same type');
  });

  sortedPolicyLists.set(sortedPolicyListKey, newSortedPolicyList);
  return newSortedPolicyList;
};

interface PolicyListArgs {
  limit: number;
  offset: number;
  sort: SortBy | null
}

const resolvers = {
  Query: {
    customers: () => customers,
    policyList: (
      _: unknown,
      { limit = policies.length, offset = 0, sort = null }: PolicyListArgs,
    ) => ({
      policies: sort === null
        ? policies
        : sortPolicies(policies, sort).slice(offset, offset + limit),
      total: policies.length,
      hasNextPage: offset + limit > policies.length,
    }),
  },
  Date: dateScalar,
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
