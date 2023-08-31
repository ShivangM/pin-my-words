'use client';
import BoardCard from '@/components/Boards/BoardCard';
import CreateNewBoard from '@/components/Boards/CreateNewBoard';
import useBoardsStore from '@/store/boardsStore';
import useUserStore from '@/store/userStore';
import { useEffect } from 'react';

const Boards = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [boards, fetchBoards] = useBoardsStore((state) => [
    state.boards,
    state.fetchBoards,
  ]);

  useEffect(() => {
    if (userData) {
      fetchBoards(userData.email);
    }
  }, [userData, fetchBoards]);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateNewBoard />
        {boards?.map((board) => (
          <BoardCard key={board._id} board={board} />
        ))}
      </div>
    </main>
  );
};

export default Boards;
