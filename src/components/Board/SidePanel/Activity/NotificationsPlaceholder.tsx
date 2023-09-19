import React from 'react';
import NotificationCardPlaceholder from './NotificationCardPlaceholder';

const NotificationsPlaceholder = () => {
  return (
    <>
      {Array.apply(null, Array(10)).map((_, idx) => (
        <NotificationCardPlaceholder key={idx} />
      ))}
    </>
  );
};

export default NotificationsPlaceholder;
