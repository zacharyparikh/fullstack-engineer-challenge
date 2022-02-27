import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { Order, SortBy } from '../types/SortBy';

interface TableHeaderProps {
  children: JSX.Element | string
  onClick: (order: Order) => void;
  field: string;
  sort: SortBy
}

function TableHeader({
  children, onClick, field, sort,
}: TableHeaderProps): JSX.Element {
  const { fields, order } = sort;
  const isSortedField = field === fields[fields.length - 1];
  const oppositeOrder = order === Order.ASC ? Order.DESC : Order.ASC;
  const newOrder = isSortedField ? oppositeOrder : Order.ASC;
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => onClick(newOrder)}
    >
      <div className="flex gap-2">
        {children}
        <span className="text-base text-indigo-600">
          {isSortedField && (order === Order.ASC ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />)}
        </span>
      </div>
    </th>
  );
}

export default TableHeader;
