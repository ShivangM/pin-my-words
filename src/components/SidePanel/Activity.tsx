import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import React, { useEffect } from 'react';
import NotificationCard from './NotificationCard';
import NotificationCardPlaceholder from './NotificationCardPlaceholder';

type Props = {};

const Activity = (props: Props) => {
  const [notifications, fetchNotifications, userAccess] = useBoardStore((state) => [state.notifications, state.fetchNotifications, state.userAccess]);
  const userId = useUserStore((state) => state.userData?.uid);

  useEffect(() => {
    if (!notifications && userId) {

      try {
        fetchNotifications(userId);
      } catch (error) {
        console.log(error);
      }
    }
  }, [notifications, userId])

  return <div className="h-full w-full">
    <div className='w-full space-y-1'>
      {
        notifications ?
          notifications.length > 0 ?
            notifications.map((notification) => {
              return <NotificationCard key={notification._id} notification={notification} />
            })
            : <div className='text-center text-gray-500'>No notifications</div>
          : Array.apply(null, Array(5)).map((_, idx) => {
            return <NotificationCardPlaceholder key={idx} />
          })
      }
    </div>
  </div>;
};

export default Activity;
