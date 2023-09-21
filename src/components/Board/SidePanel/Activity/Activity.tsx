import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationCard from './NotificationCard';
import NotificationsPlaceholder from './NotificationsPlaceholder';

type Props = {};

const Activity = (props: Props) => {
  const [notifications, fetchNotifications, board] = useBoardStore((state) => [
    state.notifications,
    state.fetchNotifications,
    state.board,
  ]);
  const [userData] = useUserStore((state) => [state.userData]);

  useEffect(() => {
    if (
      board &&
      userData &&
      notifications.data.length === 0 &&
      notifications.hasMore
    ) {
      try {
        fetchNotifications(userData?.uid!);
      } catch (error) {
        console.log(error);
      }
    }
  }, [notifications, userData, fetchNotifications, board]);

  const handleNext = async () => {
    if (board && userData) {
      fetchNotifications(userData?.uid!);
    }
  };

  return (
    <InfiniteScroll
      dataLength={notifications.data.length}
      next={handleNext}
      hasMore={notifications.hasMore}
      loader={<NotificationsPlaceholder />}
      className="w-full space-y-1"
      scrollableTarget="side-panel"
    >
      {notifications.data.map((notification, idx) => (
        <NotificationCard key={idx} notification={notification} />
      ))}
    </InfiniteScroll>
  );
};

export default Activity;
