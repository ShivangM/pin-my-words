import React, { useEffect } from 'react';
import UserCard from './UserCard';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';

type Props = {};

const Users = (props: Props) => {
  const [users, fetchUsers] = useBoardStore((state) => [state.users, state.fetchUsers]);
  const userId = useUserStore((state) => state.userData?.uid);

  useEffect(() => {
    if (!users && userId) {
      fetchUsers(userId);
    }
  }, [users, userId])


  return <div className='w-full divide-y'>
    {
      users?.map((user) => {
        return <UserCard key={user.uid} user={user} />
      })
    }
  </div>;
};

export default Users;
