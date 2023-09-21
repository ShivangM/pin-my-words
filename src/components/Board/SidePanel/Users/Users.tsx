import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';
import useUIStore from '@/store/uiStore';
import { BoardAccess } from '@/interfaces/Board.d';
import InfiniteScroll from 'react-infinite-scroll-component';
import UsersPlaceholder from './UsersPlaceholder';

type Props = {};

const Users = (props: Props) => {
  const [users, fetchUsers, userAccess, board] = useBoardStore((state) => [
    state.users,
    state.fetchUsers,
    state.userAccess,
    state.board,
  ]);

  const [userData] = useUserStore((state) => [state.userData]);

  const [toggleAddUserModal, toggleLeaveBoardModal] = useUIStore((state) => [
    state.toggleAddUserModal,
    state.toggleLeaveBoardModal,
  ]);

  useEffect(() => {
    if (board && users.data.length === 0 && userData && users.hasMore) {
      fetchUsers(userData?.uid!);
    }
  }, [users, userData, fetchUsers, board]);

  const handleNext = async () => {
    if (board && userData) {
      fetchUsers(userData?.uid!);
    }
  };

  return (
    <div className="h-full w-full">
      <InfiniteScroll
        dataLength={users.data.length}
        next={handleNext}
        hasMore={users.hasMore}
        loader={<UsersPlaceholder />}
        className="w-full space-y-1"
        height="100%"
      >
        {users.data.map((user, idx) => (
          <UserCard key={idx} user={user} />
        ))}
      </InfiniteScroll>

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
          type="button"
          className="border-blue-500 disabled:cursor-not-allowed disabled:opacity-60 border-2 text-blue-600 font-medium w-full py-2 rounded-lg transition-all ease-in-out duration-300 hover:border-blue-600"
          onClick={toggleAddUserModal}
          disabled={
            !(
              userAccess === BoardAccess.ADMIN ||
              userAccess === BoardAccess.OWNER
            )
          }
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default Users;
