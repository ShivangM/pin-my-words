'use client';
import BoardCard from '@/components/Boards/BoardCard';
import BoardsPlaceholder from '@/components/Boards/BoardsPlaceholder';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

const Boards = () => {
  const [userData] = useUserStore((state) => [state.userData]);
  const [boards, fetchBoards] = useBoardStore((state) => [
    state.boards,
    state.fetchBoards,
  ]);

  const [toggleAddBoardModal] = useUIStore((state) => [
    state.toggleAddBoardModal,
  ]);

  useEffect(() => {
    if (userData && boards.data.length === 0 && boards.hasMore) {
      try {
        fetchBoards(userData.uid!);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }, [userData, fetchBoards, boards]);

  const handleNext = async () => {
    if (userData) {
      await fetchBoards(userData?.uid!);
    }
  };

  return (
    <InfiniteScroll
      dataLength={boards.data.length}
      next={handleNext}
      hasMore={boards.hasMore}
      loader={<BoardsPlaceholder />}
      className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {/* Opens Create New Board Modal  */}
      <button
        onClick={toggleAddBoardModal}
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
      {boards.data.map((board) => (
        <BoardCard key={board._id} board={board} />
      ))}
    </InfiniteScroll>
  );
};

export default Boards;
