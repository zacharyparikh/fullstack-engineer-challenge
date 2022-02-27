import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element {
  const hasPreviousPage = currentPage !== 1;
  const hasNextPage = currentPage !== totalPages;

  const ELLIPSIS = '...';
  type PageButton = number | typeof ELLIPSIS;
  const paginationRange = useMemo((): PageButton[] => {
    const siblingCount = 1;
    const totalPageButtons = siblingCount + 5;

    if (totalPageButtons >= totalPages) {
      return range(1, totalPages);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 2;

    if (!showLeftEllipsis && showRightEllipsis) {
      return [...range(1, 5), ELLIPSIS, totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      return [1, ELLIPSIS, ...range(totalPages - 5, totalPages)];
    }

    return [
      1,
      ELLIPSIS,
      ...range(leftSibling, rightSibling),
      ELLIPSIS,
      totalPages,
    ];
  }, [currentPage, totalPages]);

  return (
    <nav>
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded shadow px-2 mx-1 border-gray-300 border font-medium hover:bg-gray-100 bg-white"
      >
        Previous
      </button>
      {paginationRange.map((button: PageButton) => (button === currentPage ? (
        <button
          type="button"
          disabled
          className="rounded shadow px-2 mx-1 border-indigo-300 border font-medium  bg-indigo-50 text-indigo-500"
        >
          {button}
        </button>
      ) : (
        <button
          type="button"
          disabled={button === ELLIPSIS}
          onClick={() => button !== ELLIPSIS && onPageChange(Number(button))}
          className="rounded shadow px-2 mx-1 border-gray-300 border font-medium hover:bg-gray-100 bg-white"
        >
          {button}
        </button>
      )))}
      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded shadow px-2 mx-1 border-gray-300 border font-medium hover:bg-gray-100 bg-white"
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
