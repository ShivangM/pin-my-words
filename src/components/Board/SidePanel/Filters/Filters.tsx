import React from 'react';
import DateFilter from './DateFilter';
import useBoardStore from '@/store/boardStore';
import { BoardModes } from '@/interfaces/Board.d';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

type Props = {};

const Filters = (props: Props) => {
  const [resetFilter, boardMode, toggleBoardMode] = useBoardStore((state) => [
    state.resetFilter,
    state.boardMode,
    state.toggleBoardMode,
  ]);

  return (
    <div className="w-full space-y-4">
      <DateFilter />

      <div className="mt-4 w-full grid grid-cols-3 p-3 gap-2 ">
        <button
          type="button"
          className="border-blue-500 col-span-2 flex items-center space-x-2 justify-center disabled:cursor-not-allowed disabled:opacity-60 border-2 text-blue-600 font-medium w-full py-2 rounded-lg transition-all ease-in-out duration-300 hover:border-blue-600"
          onClick={toggleBoardMode}
        >
          <span>Show {boardMode === BoardModes.WORDS ? 'Roots' : 'Words'}</span>{' '}
          <HiOutlineSwitchHorizontal />
        </button>

        <button
          type="button"
          className="bg-red-500 col-span-1 disabled:cursor-not-allowed disabled:opacity-60 w-full py-2 text-white text-sm font-medium rounded-lg transition-all ease-in-out duration-300 hover:bg-red-600"
          onClick={resetFilter}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Filters;
