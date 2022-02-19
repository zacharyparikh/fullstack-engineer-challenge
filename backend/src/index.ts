import { ApolloServer, gql } from 'apollo-server';
import { GraphQLScalarType, Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date scalar type',
  serialize(value) {
    return value.getTime();
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

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    policies: [Policy]
    customers: [Customer]
  }
`;

const customers = [
  {
    firstName: 'Alice',
    lastName: 'Ames',
    dateOfBirth: new Date('August 2, 1970'),
  },
  {
    firstName: 'Bob',
    lastName: 'Decker',
    dateOfBirth: new Date('September 12, 2000'),
  },
  {
    firstName: 'Carol',
    lastName: 'Easter',
    dateOfBirth: new Date('May 12, 1990'),
  },
  {
    firstName: 'Dave',
    lastName: 'Fredrickson',
    dateOfBirth: new Date('March 17, 2001'),
  },
];

const policies = [
  {
    customer: customers[0],
    provider: 'Allianz',
    insuranceType: 'LIABILITY',
    status: 'ACTIVE',
    policyNumber: 'a1',
    startDate: new Date('January 6, 2021'),
    endDate: new Date('January 6, 2024'),
    createdAt: new Date('January 1, 2021'),
  },
  {
    customer: customers[1],
    provider: 'AXA',
    insuranceType: 'HEALTH',
    status: 'CANCELLED',
    policyNumber: 'b2',
    startDate: new Date('February 12, 2018'),
    endDate: new Date('February 12, 2020'),
    createdAt: new Date('January 1, 2018'),
  },
  {
    customer: customers[2],
    provider: 'Allianz',
    insuranceType: 'HOUSEHOLD',
    status: 'DROPPED_OUT',
    policyNumber: 'c3',
    startDate: new Date('April 21, 2017'),
    endDate: new Date('January 4, 2020'),
    createdAt: new Date('April 11, 2016'),
  },
  {
    customer: customers[2],
    provider: 'Allianz',
    insuranceType: 'HEALTH',
    status: 'ACTIVE',
    policyNumber: 'c4',
    startDate: new Date('September 20, 2015'),
    endDate: new Date('September 20, 2028'),
    createdAt: new Date('January 20, 2015'),
  },
  {
    customer: customers[3],
    provider: 'Blue Cross',
    insuranceType: 'HEALTH',
    status: 'CANCELLED',
    policyNumber: 'd4',
    startDate: new Date('July 3, 1958'),
    endDate: new Date('July 3, 1959'),
    createdAt: new Date('July 3, 1957'),
  },
  {
    customer: customers[0],
    provider: 'Allianz',
    insuranceType: 'LIABILITY',
    status: 'PENDING',
    policyNumber: 'a2',
    startDate: new Date('June 29, 2012'),
    endDate: new Date('August 19, 2014'),
    createdAt: new Date('March 27, 2008'),
  },
  {
    customer: customers[1],
    provider: 'AXA',
    insuranceType: 'HEALTH',
    status: 'PENDING',
    policyNumber: 'b3',
    startDate: new Date('May 8, 2018'),
    endDate: new Date('May 26, 2020'),
    createdAt: new Date('January 1, 2018'),
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    customers: () => customers,
    policies: () => policies,
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
