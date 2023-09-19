import React from 'react';
import BoardCardPlaceholder from './BoardCardPlaceholder';

const BoardsPlaceholder = () => {
  return (
    <>
      {Array.apply(null, Array(10)).map((_, idx) => (
        <BoardCardPlaceholder key={idx} />
      ))}
    </>
  );
};

export default BoardsPlaceholder;
