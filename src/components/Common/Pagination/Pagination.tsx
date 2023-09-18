import React from 'react';
import PaginationButton from './PaginationButton';
import PaginationNextButton from './PaginationNextButton';
import PaginationPreviousButton from './PaginationPreviousButton';

type Props = {
  // totalPages: number;
  // currentPage: number;
};

const Pagination = (props: Props) => {
  return (
    <div className="flex justify-center space-x-1">
      <PaginationPreviousButton />
      {Array.from(Array(10).keys()).map((pageNumber) => (
        <PaginationButton key={pageNumber} pageNumber={pageNumber} />
      ))}
      <PaginationNextButton />
    </div>
  );
};

export default Pagination;
