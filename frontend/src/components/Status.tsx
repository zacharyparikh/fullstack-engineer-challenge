import { PolicyStatus } from '../types/Policy';

interface StatusProps {
  status: PolicyStatus;
}

export function Status({ status }: StatusProps) {
  switch (status) {
    case PolicyStatus.ACTIVE:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    case PolicyStatus.CANCELLED:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    case PolicyStatus.DROPPED_OUT:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Dropped Out
        </span>
      );
    case PolicyStatus.PENDING:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          Pending
        </span>
      );
  }
}
