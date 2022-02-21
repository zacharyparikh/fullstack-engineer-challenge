import { ApolloServer, gql } from 'apollo-server';
import { GraphQLScalarType, Kind } from 'graphql';
import customers from '../data/customers.json';
import policies from '../data/policies.json';

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

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  scalar Date

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
    policyNumber: String
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

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    policyList(offset: Int, limit: Int): PolicyList
    customers: [Customer]
  }
`;

interface PolicyListArgs {
  limit: number;
  offset: number;
}

const resolvers = {
  Query: {
    customers: () => customers,
    policyList: (_: any, { limit, offset }: PolicyListArgs) => {
      if (limit === undefined && offset === undefined) {
        return { policies };
      }

      if (limit === undefined) {
        limit = policies.length;
      }

      if (offset === undefined) {
        offset = 0;
      }

      const hasNextPage = offset + limit > policies.length;

      return {
        policies: policies.slice(offset, offset + limit),
        total: policies.length,
        hasNextPage,
      };
    },
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
