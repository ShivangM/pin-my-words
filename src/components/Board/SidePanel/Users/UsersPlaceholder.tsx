import React from 'react';
import UserCardPlaceholder from './UserCardPlaceholder';

const UsersPlaceholder = () => {
  return (
    <>
      {Array.apply(null, Array(10)).map((_, idx) => (
        <UserCardPlaceholder key={idx} />
      ))}
    </>
  );
};

export default UsersPlaceholder;
