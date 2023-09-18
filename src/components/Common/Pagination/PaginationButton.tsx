import useBoardStore from '@/store/boardStore';
import classNames from 'classnames';
import React from 'react';

type Props = {
  pageNumber: number;
};

const PaginationButton = ({ pageNumber }: Props) => {
  const [setCurrentPage, currentPage] = useBoardStore((state) => [
    state.setCurrentPage,
    state.currentPage,
  ]);

  return (
    <button
      type="button"
      title={`Page ${pageNumber}`}
      className={classNames(
        'inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md',
        currentPage === pageNumber
          ? 'bg-gray-200 text-gray-600'
          : 'bg-white text-gray-400'
      )}
      onClick={() => setCurrentPage(pageNumber)}
    >
      {pageNumber + 1}
    </button>
  );
};

export default PaginationButton;
