import './index.css';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Policy } from './types/Policy';
import Status from './components/Status';
import Pagination from './components/Pagination';
import TableHeader from './components/TableHeader';
import { Order } from './types/SortBy';

const GET_POLICIES = gql`
  query GetPolicies($offset: Int, $limit: Int, $sort: SortBy) {
    policyList(offset: $offset, limit: $limit, sort: $sort) {
      policies {
        provider
        customer {
          lastName
          firstName
          dateOfBirth
        }
        startDate
        endDate
        status
        policyNumber
        insuranceType
        createdAt
      }
      total
      hasNextPage
    }
  }
`;

interface Data {
  policyList: {
    policies: Policy[];
    total: number;
    hasNextPage: boolean;
  };
}

function App(): JSX.Element {
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState({
    fields: ['policyNumber'],
    order: Order.ASC,
  });
  const limit = 10;
  const { loading, error, data } = useQuery<Data>(GET_POLICIES, {
    variables: { offset, limit, sort: { ...sort, order: sort.order === Order.ASC ? 'ASC' : 'DESC' } },
  });

  const handlePageChange = (newPage: number) => setOffset(limit * (newPage - 1));

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  if (loading || !data) {
    return <h3>Loading...</h3>;
  }

  const { policies, total } = data.policyList;
  const currentPage = Math.ceil(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="p-6">
      <header className="pb-4">
        <h1 className="text-3xl font-medium text-gray-900">Feather Policies</h1>
      </header>

      <main className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader
                      field="policyNumber"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['policyNumber'], order })}
                    >
                      Policy Number
                    </TableHeader>
                    <TableHeader
                      field="status"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['status'], order })}
                    >
                      Status
                    </TableHeader>
                    <TableHeader
                      field="provider"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['provider'], order })}
                    >
                      Provider
                    </TableHeader>
                    <TableHeader
                      field="lastName"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['customer', 'lastName'], order })}
                    >
                      Customer Name
                    </TableHeader>
                    <TableHeader
                      field="dateOfBirth"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['customer', 'dateOfBirth'], order })}
                    >
                      Customer DOB
                    </TableHeader>
                    <TableHeader
                      field="insuranceType"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['insuranceType'], order })}
                    >
                      Type
                    </TableHeader>
                    <TableHeader
                      field="createdAt"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['createdAt'], order })}
                    >
                      Created
                    </TableHeader>
                    <TableHeader
                      field="startDate"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['startDate'], order })}
                    >
                      Start
                    </TableHeader>
                    <TableHeader
                      field="endDate"
                      sort={sort}
                      onClick={(order: Order) => setSort({ fields: ['endDate'], order })}
                    >
                      End
                    </TableHeader>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((policy: Policy) => (
                    <tr key={policy.policyNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {policy.policyNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <Status status={policy.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {policy.provider}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {`${policy.customer.lastName}, ${policy.customer.firstName}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Date(
                          policy.customer.dateOfBirth,
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {policy.insuranceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Date(policy.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Date(policy.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Date(policy.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-white px-6 py-3 flex flex-1 items-center justify-between border-t border-gray-200">
                <div>
                  <p className="font-medium text-gray-500">
                    Showing
                    {' '}
                    <span className="font-bold">{offset + 1}</span>
                    {' '}
                    to
                    {' '}
                    <span className="font-bold">{offset + limit}</span>
                    {' '}
                    of
                    {' '}
                    <span className="font-bold">{total}</span>
                    {' '}
                    policies
                  </p>
                </div>
                <div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
