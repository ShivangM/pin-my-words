import React from 'react';
import RootWordCardPlaceholder from './RootWordCardPlaceholder';

const RootWordsPlaceholder = () => {
  return (
    <>
      {Array.apply(null, Array(6)).map((_, idx) => (
        <RootWordCardPlaceholder key={idx} />
      ))}
    </>
  );
};

export default RootWordsPlaceholder;
