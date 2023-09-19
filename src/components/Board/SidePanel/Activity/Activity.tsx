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
      notifications.length === 0 &&
      userData &&
      board?.totalNotifications > 0
    ) {
      try {
        fetchNotifications(userData?.uid!, 10);
      } catch (error) {
        console.log(error);
      }
    }
  }, [notifications, userData, fetchNotifications, board]);

  const handleNext = async () => {
    const lastNotificationId = notifications[notifications.length - 1]._id;
    console.log(lastNotificationId);

    if (board && userData) {
      fetchNotifications(userData?.uid!, 10, lastNotificationId);
    }
  };

  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    if (board) {
      setHasMore(notifications.length < board.totalNotifications);
    }
  }, [board, notifications]);

  return (
    <InfiniteScroll
      dataLength={notifications.length}
      next={handleNext}
      hasMore={hasMore}
      loader={<NotificationsPlaceholder />}
      className="w-full space-y-1"
      scrollableTarget="side-panel"
    >
      {notifications.map((notification, idx) => (
        <NotificationCard key={idx} notification={notification} />
      ))}
    </InfiniteScroll>
  );
};

export default Activity;
