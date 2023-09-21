import { BoardModes } from '@/interfaces/Board.d';
import useBoardStore from '@/store/boardStore';
import convertDayValueToDate from '@/utils/convertDayValueToDate';
import moment from 'moment';
import React from 'react';

const SectionHeading = () => {
  const [selectedDate, board, filteredWords, boardMode] = useBoardStore(
    (state) => [
      state.selectedDate,
      state.board,
      state.filteredWords,
      state.boardMode,
    ]
  );

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">
        {boardMode === BoardModes.ROOT_WORDS
          ? 'All Roots'
          : selectedDate
          ? moment(convertDayValueToDate(selectedDate)).format('MMMM Do YYYY')
          : 'All Words'}
      </h2>
      <span className="text-gray-500 text-sm">
        {boardMode === BoardModes.ROOT_WORDS
          ? board?.totalRootWords
          : selectedDate
          ? filteredWords.data.length
          : board?.totalWords}{' '}
        words
      </span>
    </div>
  );
};

export default SectionHeading;
