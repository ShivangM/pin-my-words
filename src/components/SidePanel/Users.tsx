import React, { useEffect } from 'react';
import UserCard from './UserCard';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import UserCardPlaceholder from './UserCardPlaceholder';
import useUIStore from '@/store/uiStore';
import { BoardAccess } from '@/interfaces/Board.d';

type Props = {};

const Users = (props: Props) => {
  const [users, fetchUsers, userAccess] = useBoardStore((state) => [state.users, state.fetchUsers, state.userAccess]);
  const userId = useUserStore((state) => state.userData?.uid);
  const [toggleAddUserModal, toggleLeaveBoardModal] = useUIStore((state) => [state.toggleAddUserModal, state.toggleLeaveBoardModal]);

  useEffect(() => {
    if (!users && userId) {
      fetchUsers(userId);
    }
  }, [users, userId])


  return (
    <div className="h-full w-full py-2">
      <div className='w-full divide-y'>
        {
          users ? users.map((user) => {
            return <UserCard key={user.uid} user={user} />
          })
            : Array.apply(null, Array(5)).map((_, idx) => {
              return <UserCardPlaceholder key={idx} />
            })
        }
      </div>

      <div className="mt-4 w-full grid grid-cols-2 p-3 gap-2 ">
        <button
          type="button"
          disabled={userAccess === BoardAccess.OWNER}
          className="bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 w-full py-2 text-white text-sm font-medium rounded-lg transition-all ease-in-out duration-300 hover:bg-red-600"
          onClick={toggleLeaveBoardModal}
        >
          Leave Board
        </button>

        <button
          type="submit"
          className="border-blue-500 disabled:cursor-not-allowed disabled:opacity-60 border-2 text-blue-600 font-medium w-full py-2 rounded-lg transition-all ease-in-out duration-300 hover:border-blue-600"
          onClick={toggleAddUserModal}
          disabled={!(userAccess === BoardAccess.ADMIN || userAccess === BoardAccess.OWNER)}
        >
          Add User
        </button>
      </div>
    </div>
  )
};

export default Users;
