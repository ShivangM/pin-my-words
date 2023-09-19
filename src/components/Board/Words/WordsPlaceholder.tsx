import React from 'react';
import WordsCardPlaceholder from './WordCardPlaceholder';

const WordsPlaceholder = () => {
  return (
    <div className="flex flex-col space-y-6">
      {Array.apply(null, Array(10)).map((_, idx) => (
        <WordsCardPlaceholder key={idx} idx={idx} />
      ))}
    </div>
  );
};

export default WordsPlaceholder;
