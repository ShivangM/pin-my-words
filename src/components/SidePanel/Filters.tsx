import React from 'react';
import DateFilter from './DateFilter';
import useBoardStore from '@/store/boardStore';

type Props = {};

const Filters = (props: Props) => {
  const [resetFilter] = useBoardStore((state) => [state.resetFilter]);
  return <div className='w-full space-y-4' >
    <DateFilter />

    <button onClick={resetFilter} className='btn' >Reset Filters</button>
  </div>;
};

export default Filters;
