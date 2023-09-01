'use client';
import BoardCard from '@/components/Boards/BoardCard';
import useBoardsStore from '@/store/boardsStore';
import useUserStore from '@/store/userStore';
import Image from 'next/image';
import { useEffect } from 'react';

const Boards = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [boards, fetchBoards, openCreateBoardModal] = useBoardsStore(
    (state) => [state.boards, state.fetchBoards, state.openCreateBoardModal]
  );

  useEffect(() => {
    if (userData) {
      fetchBoards(userData.email);
    }
  }, [userData, fetchBoards]);

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Opens Create New Board Modal  */}
      <button
        onClick={openCreateBoardModal}
        className="p-6 text-left cursor-pointer border-2 border-dashed border-spacing-4 hover:border-brand transition-all ease-in-out duration-200 rounded-md"
      >
        <div className="w-full relative rounded-md overflow-hidden aspect-square">
          <Image
            src="/assets/board-placeholder.svg"
            alt="Create a new board"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="mt-6 mb-2">
          <h2 className="text-xl font-semibold">Create a new board</h2>
        </div>
        <p className="">Add a new board.</p>
      </button>

      {/* Boards */}
      {boards?.map((board) => (
        <BoardCard key={board._id} board={board} />
      ))}
    </div>
  );
};

export default Boards;
